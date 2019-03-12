"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var Router = require("koa-router");
var captchapng = require("captchapng");
var typeorm_1 = require("typeorm");
var passport_1 = require("../components/passport");
var User_1 = require("../entity/User");
var router = new Router();
router.post("/register", function (ctx) { return __awaiter(_this, void 0, void 0, function () {
    var _a, account, password, existentUser, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = ctx.request.body, account = _a.mail, password = _a.password;
                return [4 /*yield*/, typeorm_1.getRepository(User_1.User)
                        .createQueryBuilder("user")
                        .where("user.account=:account", { account: account })
                        .getOne()];
            case 1:
                existentUser = _b.sent();
                if (existentUser) {
                    ctx.status = 400;
                    ctx.body = { errMsg: "该用户已存在" };
                    return [2 /*return*/];
                }
                return [4 /*yield*/, typeorm_1.getRepository(User_1.User).create({
                        account: account,
                        password: password,
                        roleName: "user",
                        nickName: account
                    })];
            case 2:
                user = _b.sent();
                return [4 /*yield*/, typeorm_1.getRepository(User_1.User).save(user)];
            case 3:
                _b.sent();
                ctx.status = 200;
                ctx.body = { msg: "注册成功" };
                return [2 /*return*/];
        }
    });
}); });
router.post("/login", function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, passport_1.default.authenticate('local', function (err, user, info) {
                if (!user || err) {
                    ctx.status = 400;
                    ctx.body = info;
                    return;
                }
                ctx.status = 200;
                ctx.body = user;
                return ctx.login(user);
            })(ctx, next)];
    });
}); });
router.post("/logout", function (ctx) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        ctx.logout();
        ctx.status = 200;
        ctx.body = { msg: "退出成功" };
        return [2 /*return*/];
    });
}); });
router.post("/getpublickey", function (ctx) { return __awaiter(_this, void 0, void 0, function () {
    var publicKey;
    return __generator(this, function (_a) {
        publicKey = fs.readFileSync(path.join(process.cwd(), "utils/rsa_1024_pub.pem"), "utf8");
        ctx.body = { item: publicKey };
        return [2 /*return*/];
    });
}); });
router.post("/getcaptcha", function (ctx) { return __awaiter(_this, void 0, void 0, function () {
    var cap, p, base64;
    return __generator(this, function (_a) {
        cap = Math.random() * 9000 + 1000;
        p = new captchapng(80, 30, cap);
        p.color(255, 255, 2, 3);
        p.color(255, 80, 80, 255);
        base64 = p.getBase64();
        if (!base64) {
            ctx.status = 400;
            ctx.body = { errMsg: "获取验证码失败" };
        }
        else {
            ctx.session.cap = cap;
            ctx.status = 200;
            ctx.body = { item: base64 };
        }
        return [2 /*return*/];
    });
}); });
router.post("/verifycaptcha", function (ctx) { return __awaiter(_this, void 0, void 0, function () {
    var captcha, cap;
    return __generator(this, function (_a) {
        captcha = ctx.request.body.captcha;
        cap = ctx.session.cap;
        if (captcha === "" + cap) {
            ctx.status = 200;
            ctx.body = { msg: "验证成功" };
        }
        else {
            ctx.status = 400;
            ctx.body = { errMsg: "验证失败" };
        }
        return [2 /*return*/];
    });
}); });
exports.default = router.routes();
//# sourceMappingURL=account.js.map