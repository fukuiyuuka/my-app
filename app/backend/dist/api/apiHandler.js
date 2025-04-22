"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiHandler = void 0;
const t = __importStar(require("@yukafukui/shared-type"));
//API実行
//エラー処理、ログ出力処理
const apiHandler = (api) => {
    return async (req, res) => {
        console.log(`-Controller ${req.method} ${req.path} BEGIN-`);
        try {
            await api(req, res);
        }
        catch (e) {
            console.error(e);
            //異常終了
            const resBody = t.CommonResSchema.safeParse(e)
                ? t.CommonResSchema.parse(e)
                : { code: -1, message: "異常終了" };
            res.json(resBody);
        }
        finally {
            console.log(`-Controller ${req.method} ${req.path} END-`);
        }
    };
};
exports.apiHandler = apiHandler;
