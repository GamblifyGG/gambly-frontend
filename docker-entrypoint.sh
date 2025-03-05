#!/bin/sh
set -e

# replace env variable placeholders with real values
printenv | grep NEXT_PUBLIC_ | while read -r line ; do
  key=$(echo $line | cut -d "=" -f1)
  value=$(echo $line | cut -d "=" -f2)

  find /app/.next -type f -exec sed -i "s|__${key}__|$value|g" {} \;
  sed -i "s|__${key}__|$value|g" /app/server.js
done

exec "$@"
