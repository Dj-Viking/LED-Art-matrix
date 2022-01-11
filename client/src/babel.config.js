module.exports = function (api) {
  const presets = [
    [
      "@babel/preset-env",
      { targets: { node: "current" } },
    ],
    ["@babel/preset-react"],
    ["@babel/preset-typescript"],
  ];
  const plugins = [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties"
  ]
  api.cache(false);
  return {
    presets,
    plugins
  };
};