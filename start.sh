#! bin/bash
PROD="production"
echo "node env is _$NODE_ENV _ "

if [ "$NODE_ENV" = "$PROD" ]; then
  echo "==============================="
  echo "🔮✨ starting app in production mode 🚀"
  echo "==============================="
  npm run start:prod;
elif ! [ "$NODE_ENV" = "$PROD" ]; then
  echo "==============================="
  echo "🔮✨ starting app in dev mode 🛠"
  echo "==============================="
  echo ""
  echo "if you want your mongo server to work with docker make sure"
  echo "you set the env.txt for the server/ directory for MONGODB_URI env variable"
  echo "so that the application can connect to the mongo docker container "
  echo "started via `docker compose up`"
  echo "or started via `sudo docker compose up`"
  echo ""
  echo "==============================="

  # if you want your mongo server to work with docker make sure
  # you set the env.txt for the server/ directory for MONGODB_URI env variable
  # so that the application can connect to the mongo docker container 
  # started via `docker compose up`
  
  npm run start:dev;
fi
