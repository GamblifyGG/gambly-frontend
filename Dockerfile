# base image
FROM node:22-alpine AS base

# pnpm setup
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# corepack setup
# fix for pnpm 10.1.0
ENV COREPACK_INTEGRITY_KEYS=0
# download quietly
# todo: corepack shouldn't be downloading pnpm in the runner
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# builder image
FROM base AS build

# install node-gyp goodies
RUN apk add --no-cache \
    build-base \
    python3

# copy source files
COPY . /app
WORKDIR /app

# install deps
# build a compact package to build a standalone next app from
# todo: no --prod because we want postcss-import for build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --filter="@gambly/frontend" --frozen-lockfile --prefer-offline && \
    pnpm deploy --filter="@gambly/frontend" /app/pruned

# next needs env vars at build stage, so let's supply placeholders
# solution yoinked from https://medium.com/@ihcnemed/nextjs-on-docker-managing-environment-variables-across-different-environments-972b34a76203
# todo: note that this won't work if the variable is transformed in any way
# e.g. html-escaped, lowercased
# will also break if the actual values contain certain special characters
ENV NEXT_PUBLIC_API_URL=__NEXT_PUBLIC_API_URL__
ENV NEXT_PUBLIC_AUTH_LKEY=__NEXT_PUBLIC_AUTH_LKEY__
ENV NEXT_PUBLIC_REOWN_PROJECT_ID=__NEXT_PUBLIC_REOWN_PROJECT_ID__
ENV NEXT_PUBLIC_BACKEND_URL=__NEXT_PUBLIC_BACKEND_URL__
ENV NEXT_PUBLIC_WEBSITE_LINK=__NEXT_PUBLIC_WEBSITE_LINK__
ENV NEXT_PUBLIC_WEBSITE_NAME=__NEXT_PUBLIC_WEBSITE_NAME__
ENV NEXT_PUBLIC_COMPANY_NAME=__NEXT_PUBLIC_COMPANY_NAME__
ENV NEXT_PUBLIC_COMPANY_NUMBER=__NEXT_PUBLIC_COMPANY_NUMBER__
ENV NEXT_PUBLIC_COMPANY_ADDRESS=__NEXT_PUBLIC_COMPANY_ADDRESS__

# disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# build a standalone next.js server
WORKDIR /app/pruned
RUN --mount=type=cache,id=next,target=/app/pruned/.next/cache pnpm run build

# runner image
FROM base AS frontend
WORKDIR /app

# copy standalone build with static files
COPY --chown=node:node --from=build /app/pruned/.next/standalone ./
COPY --chown=node:node --from=build /app/pruned/.next/static ./.next/static
COPY --chown=node:node --from=build /app/pruned/public ./public

# this entrypoint substitutes env vars in the built next app
# so we can ship a docker image without baked-in env vars
COPY --chown=node:node --from=build /app/pruned/docker-entrypoint.sh ./

# next-logger config
COPY --chown=node:node --from=build /app/pruned/next-logger.config.js ./

# default http port
EXPOSE 3000

# force bind to 0.0.0.0:3000
ENV HOSTNAME="0.0.0.0"
ENV PORT="3000"

# start the application
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["pnpm", "--silent", "run", "start"]
