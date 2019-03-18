export = (appInfo: any) => {
  const config: any = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1552632441524_9669';

  // add your config here
  config.middleware = ["filterOptions"];

  config.hello="this is hello"

  config.security={
    csrf: {
      enable: false,
    },
}

  return config;
};
