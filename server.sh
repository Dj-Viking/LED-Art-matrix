#! bin/bash
PROD="production"
echo "node env is _$NODE_ENV _ "

cd server;
if [ "$NODE_ENV" = "$PROD" ]; then
  echo "==============================="
  echo "🔮✨ starting app in production mode 🚀"
  echo "==============================="

  if [ -d "dist" ]; then
    echo "found dist directory, starting server..."
    node dist/index.js;
  elif ! [ -d "dist" ]; then
    echo "no dist folder detected, compiling typescript, and then starting server"
    npm run tsc;
    node dist/index.js;
  fi

elif ! [ "$NODE_ENV" = "$PROD" ]; then
  echo "==============================="
  echo "🔮✨ starting app in dev mode 🛠"
  echo "==============================="

  if [ -d "dist" ]; then
    echo "found dist directory, starting server..."
    npm run concurrently;
  elif ! [ -d "dist" ]; then
    echo "no dist folder detected, compiling typescript, and then starting server"
    npm run concurrently;
  fi

fi
