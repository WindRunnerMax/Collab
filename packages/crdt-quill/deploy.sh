set -ex

mkdir -p build
cp -R public/ ./build/ 

npx rollup -c
npx rollup --config rollup.server.js


