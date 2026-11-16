# NetFocus CCTV

React Native (JavaScript / TypeScript) surveillance app UI with onboarding, login, home dashboard, multi-channel live view, playback timeline, PTZ controls, and device setup.

## Run Locally

**Prerequisites:** [Node.js](https://nodejs.org/) (18+), JDK 17, and [Android Studio](https://developer.android.com/studio) with Android SDK.

1. Install dependencies: `npm install`
2. Create a file named `.env` in the project directory and set `GEMINI_API_KEY` in that file to your Gemini API key (see `.env.example` for an example)
3. Ensure `JAVA_HOME` points to your JDK 17 installation.
4. Run the app on a running emulator or connected Android device: `npm run android` (this starts Metro and builds and installs the app).

This is a bare React Native project, not an Expo project. Do not use `npx expo start` or Expo Go; use the React Native CLI commands above.

## Project Structure

- `src/types.ts` — domain models (screens, devices, channels, alerts, snapshots)
- `src/theme.ts` — design tokens (colors, typography, spacing)
- `src/state.tsx` — global app state / actions (state container + playback ticker)
- `src/components/` — shared UI (chrome, artwork, camera feed, modals)
- `src/screens/` — app screens (welcome, login, home, live view, playback, add device, devices, settings)
- `App.tsx` — app root and navigation switch
- `src/assets/` — fonts and images

## Android

The Android host (`app/src/main`) is a standard React Native host written in Java (`MainActivity` / `MainApplication`); all app UI lives in the React Native JavaScript/TypeScript layer. Use JDK 17 to build it.

## iOS

The iOS host (`ios/`) is a standard React Native host written in Swift/Objective-C.
