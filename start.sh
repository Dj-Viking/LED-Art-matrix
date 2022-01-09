#! bin/bash
PROD="production"
echo "node env is _$NODE_ENV _ "

if [[ "$NODE_ENV" == "$PROD" ]]; then
  echo "==============================="
  echo "🔮✨ starting app in production mode 🚀"
  echo "==============================="
  npm run start:prod
elif ! [[ "$NODE_ENV" == "$PROD" ]]; then
  echo "==============================="
  echo "🔮✨ starting app in dev mode 🛠"
  echo "==============================="
  npm run start:dev
fi