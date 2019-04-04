"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
exports.default = (app) => {
    app.beforeStart(async () => {
        await typeorm_1.createConnection();
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRCQUEwQjtBQUMxQixxQ0FBeUM7QUFFekMsa0JBQWUsQ0FBQyxHQUFHLEVBQUMsRUFBRTtJQUNwQixHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBRyxFQUFFO1FBQ3hCLE1BQU0sMEJBQWdCLEVBQUUsQ0FBQztJQUMzQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQSJ9