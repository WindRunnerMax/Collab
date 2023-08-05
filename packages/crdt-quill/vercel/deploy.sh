set -ex

cp  vercel.json ../

cd ../
pwd

mkdir -p build
cp -R public/ ./build/ 

npx rollup -c
npx rollup --config rollup.server.js


