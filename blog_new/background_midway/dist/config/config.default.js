"use strict";
module.exports = (appInfo) => {
    const config = exports = {};
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1552632441524_9669';
    // add your config here
    config.middleware = ["passport"];
    config.security = {
        domainWhiteList: ["http://127.0.0.1:8000", "http://127.0.0.1:8080", "http://127.0.0.1:80", "http://120.78.139.146:80"],
        csrf: {
            enable: false,
        },
    };
    config.cors = {
        credentials: true
    };
    config.multipart = {
        mode: "stream",
        fileSize: "10mb",
        whitelist: [".png", ".jpg", ".jpeg", ".gif"]
    };
    config.cluster = {
        listen: {
            port: 7001
        }
    };
    return config;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmRlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2NvbmZpZy5kZWZhdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpQkFBUyxDQUFDLE9BQVksRUFBRSxFQUFFO0lBQ3hCLE1BQU0sTUFBTSxHQUFRLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFFakMsdUVBQXVFO0lBQ3ZFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxxQkFBcUIsQ0FBQztJQUVuRCx1QkFBdUI7SUFDdkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRWpDLE1BQU0sQ0FBQyxRQUFRLEdBQUc7UUFDaEIsZUFBZSxFQUFFLENBQUMsdUJBQXVCLEVBQUUsdUJBQXVCLEVBQUMscUJBQXFCLEVBQUMsMEJBQTBCLENBQUM7UUFDcEgsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFLEtBQUs7U0FDZDtLQUNGLENBQUE7SUFFRCxNQUFNLENBQUMsSUFBSSxHQUFHO1FBQ1osV0FBVyxFQUFFLElBQUk7S0FDbEIsQ0FBQTtJQUVELE1BQU0sQ0FBQyxTQUFTLEdBQUc7UUFDakIsSUFBSSxFQUFFLFFBQVE7UUFDZCxRQUFRLEVBQUUsTUFBTTtRQUNoQixTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUM7S0FDN0MsQ0FBQTtJQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUc7UUFDZixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUUsSUFBSTtTQUNYO0tBQ0YsQ0FBQTtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQyJ9