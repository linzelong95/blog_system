export = (appInfo: any) => {
  const config: any = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1552632441524_9669';

  // add your config here
  config.middleware = ["passport"];

  config.hello = "this is hello"

  config.security = {
    domainWhiteList: ["http://localhost:8000", "http://localhost:8080","http://192.168.1.10"],
    csrf: {
      enable: false,
    },
  }

  config.cors = {
    credentials: true
  }

  config.multipart = {
    mode: "stream",
    fileSize: "10mb",
    whitelist: [".png", ".jpg", ".jpeg", ".gif"]
  }

  config.cluster = {
    listen: {
      port: 7001
    }
  }

  return config;
};
