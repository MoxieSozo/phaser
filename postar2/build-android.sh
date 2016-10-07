#!/bin/bash

rm "releases/android/MicrostarPostar-$2.apk"
## Deploying to Android
# Build the release sdk ( creates android-release-unsigned.apk)

ionic build --release android
# Sign the apk : enter Latitude40 when asked for password
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore postar.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk postar
# use zipalign to create the deployment version
"/Users/home/Library/Android/sdk/build-tools/$1/zipalign" -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk "releases/android/MicrostarPostar-$2.apk"

