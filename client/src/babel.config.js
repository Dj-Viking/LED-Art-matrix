// eslint-disable-next-line
module.exports = function (api) {
  api.cache(true,);
  return {
    presets: [
      "@babel/react", 
      "@babel/typescript", 
      [
        "@babel/env",
        { modules: false, },
      ],
    ],
  };
};