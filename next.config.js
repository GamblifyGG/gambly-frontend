const path = require('path');

const nextConfig = {
  // output: 'standalone',
  experimental: {
    // todo: for a monorepo scenario
    // not needed when using `pnpm deploy`
    // outputFileTracingRoot: path.join(__dirname, '../../'),
    instrumentationHook: true,
  },
  images: {
    unoptimized: true,
    domains: [
      'i.postimg.cc',
      'gambly-token-logos.sfo3.digitaloceanspaces.com',
      'gambly-token-logos.sfo3.cdn.digitaloceanspaces.com',
      'arweave.net',
      '*'
    ],
  },
  reactStrictMode: false,
  webpack: (config) => {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              dimensions: false,
            },
          },
        ],
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    config.module.rules.push({
      test: /\.mp3$/,
      use: {
        loader: 'file-loader',
      },
    });

    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // todo: workaround for missing imports when building standalone in a monorepo
    config.externals.push({
      '@gambly/logger': 'commonjs @gambly/logger',
      'next-logger': 'commonjs next-logger',
      'sharp': 'commonjs sharp',
    })
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AUTH_LKEY: "AUTH_v3",
    NEXT_PUBLIC_REOWN_PROJECT_ID: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_WEBSITE_LINK: process.env.NEXT_PUBLIC_WEBSITE_LINK,
    NEXT_PUBLIC_WEBSITE_NAME: process.env.NEXT_PUBLIC_WEBSITE_NAME,
    NEXT_PUBLIC_COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME,
    NEXT_PUBLIC_COMPANY_NUMBER: process.env.NEXT_PUBLIC_COMPANY_NUMBER,
    NEXT_PUBLIC_COMPANY_ADDRESS: process.env.NEXT_PUBLIC_COMPANY_ADDRESS,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')],
    prependData: `@import "src/styles/scss/_vars.scss"; @import "src/styles/scss/_mixins.scss";`,
  },
};

module.exports = nextConfig;
