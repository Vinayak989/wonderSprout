# WonderSprout mobile app

This Expo app gives Android and iOS their own compact, touch-first experience: a subject garden, quick quiz rounds, and a parent or teacher progress view. The quiz content comes from the WonderSprout API; age, language, answer totals, and completed rounds are saved on the device.

## Run on a device

From this directory, install packages with `npm install`, then start Expo with `npm run start`. Use Expo Go during development or create a native build for device testing.

## Android APK

On Windows with Android Studio and the Android SDK installed, run `npm run build:android:apk`. It creates `android/app/build/outputs/apk/debug/app-debug.apk`. This is a signed debug APK that can be sideloaded on an Android device.

EAS Build is configured for an internal Android APK with `eas build --platform android --profile preview`.

## iOS

The Expo project and iOS bundle identifier are configured for EAS Build. An installable iPhone IPA needs an Apple Developer signing certificate and provisioning profile. Run `eas build --platform ios --profile preview` after signing in to the Expo account and configuring Apple signing credentials. Those credentials should be entered through EAS, not committed here.

The mobile app uses `https://wonder-sprout.onrender.com/api` by default. Set `EXPO_PUBLIC_API_URL` to a different API origin when building another environment.
