"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var multer = require("koa-multer");
//文件上传
var upload = multer({
    storage: multer.diskStorage({
        //文件保存路径
        destination: function (req, file, cb) { return cb(null, 'statics/img/article'); },
        //修改文件名称
        filename: function (req, file, cb) {
            var fileFormat = (file.originalname).split(".");
            cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }
    })
});
exports.default = upload;
//# sourceMappingURL=upload.js.map