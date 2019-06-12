export = (appInfo: any) => {
  const config: any = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1552632441524_9669';

  // add your config here
  config.middleware = ["passport"];

  config.security = {
    domainWhiteList: ["http://127.0.0.1:8000", "http://127.0.0.1:8080","http://127.0.0.1:80","http://120.78.139.146:80"],
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
