const { getDefaultConfig } = require("metro-config");
const { resolver: defaultResolver } = getDefaultConfig.getDefaultValues();
module.exports = {
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles']
  }
};
exports.resolver = {
  ...defaultResolver,
  sourceExts: [...defaultResolver.sourceExts, "cjs"],
};
