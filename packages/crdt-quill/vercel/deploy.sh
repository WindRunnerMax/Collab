set -ex

mkdir -p build/static
cp  ./vercel/vercel.json ./
cp  ./vercel/server.js build/
cp -R public/ ./build/static 

npx rollup --config ./vercel/rollup.config.js

