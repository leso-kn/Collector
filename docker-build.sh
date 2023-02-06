#!/bin/sh

cd "$(dirname $0)"

docker run --user=root --rm -ti -v "$PWD":/app --workdir /app \
  reactnativecommunity/react-native-android \
  sh -c "
  set -e
  rm -rf ~/.gradle
  mkdir -p .cache
  ln -rs .cache ~/.gradle
  yarn install
  cd android
  chmod +x gradlew
  ./gradlew --no-daemon assembleRelease"

printf "\033[1;32mDone\033[0m\n"
find -name \*.apk -exec realpath {} \;
