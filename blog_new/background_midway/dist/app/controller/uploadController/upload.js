"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const midway_1 = require("midway");
const fs = require("fs");
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
let UploadController = class UploadController {
    async upload(ctx) {
        const stream = await ctx.getFileStream();
        const filename = `${Date.now()}${stream.filename}`;
        const target = `${ctx.app.baseDir}/app/public/img/article/${filename}`;
        const writeStream = fs.createWriteStream(target);
        try {
            await awaitWriteStream(stream.pipe(writeStream));
        }
        finally {
            await sendToWormhole(stream);
        }
        ctx.body = { url: `/public/img/article/${filename}` };
    }
};
__decorate([
    midway_1.post("/file"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "upload", null);
UploadController = __decorate([
    midway_1.provide(),
    midway_1.controller("/upload")
], UploadController);
exports.UploadController = UploadController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9jb250cm9sbGVyL3VwbG9hZENvbnRyb2xsZXIvdXBsb2FkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbUNBQW1EO0FBQ25ELHlCQUF5QjtBQUN6QixNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUM3RCxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUlsRCxJQUFhLGdCQUFnQixHQUE3QixNQUFhLGdCQUFnQjtJQUkzQixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUc7UUFDZCxNQUFNLE1BQU0sR0FBQyxNQUFNLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN2QyxNQUFNLFFBQVEsR0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDakQsTUFBTSxNQUFNLEdBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sMkJBQTJCLFFBQVEsRUFBRSxDQUFDO1FBQ3JFLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxJQUFHO1lBQ0QsTUFBTSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7U0FDbEQ7Z0JBQU87WUFDTixNQUFNLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM5QjtRQUNELEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsdUJBQXVCLFFBQVEsRUFBRSxFQUFDLENBQUM7SUFDdkQsQ0FBQztDQUNGLENBQUE7QUFaQztJQURDLGFBQUksQ0FBQyxPQUFPLENBQUM7Ozs7OENBWWI7QUFmVSxnQkFBZ0I7SUFGNUIsZ0JBQU8sRUFBRTtJQUNULG1CQUFVLENBQUMsU0FBUyxDQUFDO0dBQ1QsZ0JBQWdCLENBZ0I1QjtBQWhCWSw0Q0FBZ0IifQ==