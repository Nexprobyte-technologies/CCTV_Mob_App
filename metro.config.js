const { getDefaultConfig } = require('@react-native/metro-config');

/**
 * Metro configuration for NetFocus CCTV.
 *
 * Build folders (.gradle, build, app/build, .kotlin) are excluded from the
 * file map so Metro's watcher doesn't crash when Gradle creates/removes
 * temporary directories during builds.
 */
module.exports = getDefaultConfig(__dirname, {
  resolver: {
    blockList: [
      /\.gradle[\/\\]/,
      /^[\/\\]?\.kotlin[\/\\]/,
      /(^|[\/\\])app[\/\\]build[\/\\]/,
      /(^|[\/\\])build[\/\\]/,
    ],
  },
});
