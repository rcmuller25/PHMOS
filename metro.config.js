// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for handling modules properly
config.resolver.sourceExts.push('cjs');
config.resolver.assetExts = ['ttf', 'woff', 'woff2', 'eot', 'svg', 'png', 'jpg', 'jpeg', 'gif', 'ico'];

module.exports = config;