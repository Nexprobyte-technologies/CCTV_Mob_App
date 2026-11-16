/**
 * React Native CLI configuration for NetFocus CCTV.
 *
 * The Android build lives at the repository root (not inside an `android/`
 * subfolder), so we describe the layout explicitly for the CLI.
 */
module.exports = {
  project: {
    android: {
      sourceDir: '.',
      appName: 'app',
      packageName: 'com.example',
      manifestPath: 'app/src/main/AndroidManifest.xml',
    },
  },
};
