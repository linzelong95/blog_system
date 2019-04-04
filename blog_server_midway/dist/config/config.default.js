"use strict";
module.exports = (appInfo) => {
    const config = exports = {};
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1552632441524_9669';
    // add your config here
    config.middleware = ["passport"];
    config.hello = "this is hello";
    config.security = {
        domainWhiteList: ["http://localhost:8000", "http://192.168.1.10"],
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
    // config.cluster={
    //   listen:{
    //     port:7001,
    //     hostname:"120.78.139.146"
    //   }
    // }
    return config;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmRlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL2NvbmZpZy5kZWZhdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpQkFBUyxDQUFDLE9BQVksRUFBRSxFQUFFO0lBQ3hCLE1BQU0sTUFBTSxHQUFRLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFFakMsdUVBQXVFO0lBQ3ZFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxxQkFBcUIsQ0FBQztJQUVuRCx1QkFBdUI7SUFDdkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRWpDLE1BQU0sQ0FBQyxLQUFLLEdBQUMsZUFBZSxDQUFBO0lBRTVCLE1BQU0sQ0FBQyxRQUFRLEdBQUM7UUFDZCxlQUFlLEVBQUMsQ0FBQyx1QkFBdUIsRUFBQyxxQkFBcUIsQ0FBQztRQUMvRCxJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUUsS0FBSztTQUNkO0tBQ0YsQ0FBQTtJQUVELE1BQU0sQ0FBQyxJQUFJLEdBQUM7UUFDVixXQUFXLEVBQUUsSUFBSTtLQUNsQixDQUFBO0lBRUQsTUFBTSxDQUFDLFNBQVMsR0FBQztRQUNmLElBQUksRUFBQyxRQUFRO1FBQ2IsUUFBUSxFQUFDLE1BQU07UUFDZixTQUFTLEVBQUMsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE9BQU8sRUFBQyxNQUFNLENBQUM7S0FDekMsQ0FBQTtJQUVELG1CQUFtQjtJQUNuQixhQUFhO0lBQ2IsaUJBQWlCO0lBQ2pCLGdDQUFnQztJQUNoQyxNQUFNO0lBQ04sSUFBSTtJQUVKLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQyJ9