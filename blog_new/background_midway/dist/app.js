"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
exports.default = (app) => {
    app.beforeStart(async () => {
        const { env } = app.config;
        const dir = env === "prod" ? "dist" : "src";
        await typeorm_1.createConnection({
            "type": "mysql",
            "host": env === "prod" ? "127.0.0.1" : "120.78.139.146",
            "port": 3306,
            "username": "root",
            "password": "admin",
            "database": "myblog",
            "synchronize": true,
            "logging": false,
            "entities": [`${dir}/entity/**/*{.ts,.js}`],
            "migrations": [`${dir}/migration/**/*{.ts,.js}`],
            "subscribers": [`${dir}/subscriber/**/*{.ts,.js}`]
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRCQUEwQjtBQUMxQixxQ0FBMkM7QUFFM0Msa0JBQWUsQ0FBQyxHQUFRLEVBQUUsRUFBRTtJQUMxQixHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3pCLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQzNCLE1BQU0sR0FBRyxHQUFHLEdBQUcsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzVDLE1BQU0sMEJBQWdCLENBQUM7WUFDckIsTUFBTSxFQUFFLE9BQU87WUFDZixNQUFNLEVBQUUsR0FBRyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0I7WUFDdkQsTUFBTSxFQUFFLElBQUk7WUFDWixVQUFVLEVBQUUsTUFBTTtZQUNsQixVQUFVLEVBQUUsT0FBTztZQUNuQixVQUFVLEVBQUUsUUFBUTtZQUNwQixhQUFhLEVBQUUsSUFBSTtZQUNuQixTQUFTLEVBQUUsS0FBSztZQUNoQixVQUFVLEVBQUUsQ0FBQyxHQUFHLEdBQUcsdUJBQXVCLENBQUM7WUFDM0MsWUFBWSxFQUFFLENBQUMsR0FBRyxHQUFHLDBCQUEwQixDQUFDO1lBQ2hELGFBQWEsRUFBRSxDQUFDLEdBQUcsR0FBRywyQkFBMkIsQ0FBQztTQUNuRCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQSJ9