"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("koa-multer");
//文件上传
const upload = multer({
    storage: multer.diskStorage({
        //文件保存路径
        destination: (req, file, cb) => cb(null, 'statics/img/article'),
        //修改文件名称
        filename: (req, file, cb) => {
            var fileFormat = (file.originalname).split(".");
            cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }
    })
});
exports.default = upload;
//# sourceMappingURL=upload.js.map