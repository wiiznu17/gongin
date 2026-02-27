module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind", "react-compiler": false }]
    ],
    plugins: ["react-native-reanimated/plugin"],
  };
};
