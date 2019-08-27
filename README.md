# NotesApp

A React Native Application to take notes.
This is a simple application I created to take notes in React Native.

## Installation

---

1. Run `yarn` to update the packages listed in the package.json.
2. go into iOS folder, and run `pod install`. This is a necessary step for running in iOS.

## Running the App for development

Run either `react-native run-android` or `react-native run-ios` to start the app in simulator/ phone you've plugged in.

## Running a working APK in your device

1. Run this command:

   ```sh
   react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
   ```

2. Next:

  ```sh
  cd android
  #Create debug build:
  $ ./gradlew assembleDebug
  #Create release build:
  $ ./gradlew assembleRelease #Generated `apk` will be located at `android/app/build/outputs/apk`
  ```

## Sources

---

1. Using [`use-global-hook`]('https://medium.com/javascript-in-plain-english/state-management-with-react-hooks-no-redux-or-context-api-8b3035ceecf8) for State management.
