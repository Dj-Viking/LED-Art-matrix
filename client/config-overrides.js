module.exports = function override(config, env) {
  console.log('override webpack config');

  //making a new copy of the current default cra webpack config plugin for InjectManifest()
  // and assigning a new property to that config with a new additional value
  // in this case I want to cache bigger file sizes for my app
  // namely the main chunk stylesheet
  console.log('\x1b[33m', 'old config', '\x1b[00m');
  console.log(config.plugins[8]);

  config.plugins[8].config = {
    ...config.plugins[8].config,
    maximumFileSizeToCacheInBytes: 3200000
  };

  console.log('\x1b[33m', 'new config', '\x1b[00m');
  console.log(config.plugins[8]);
  return config;
}