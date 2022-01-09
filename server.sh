#! bin/bash
cd server;
if [ -d "dist" ]; then
  echo "found dist directory, starting server..."
  node dist/index.js
elif ! [ -d "dist" ]; then
  echo "no dist folder detected, compiling typescript, and then starting server"
  npm run tsc;
  node dist/index.js
fi