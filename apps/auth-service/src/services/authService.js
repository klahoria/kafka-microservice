"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const register = async (email, password) => {
    const hashed = await bcrypt_1.default.hash(password, 10);
    await db_1.pool.execute("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashed]);
    return { message: "User registered" };
};
exports.register = register;
const login = async (email, password) => {
    const [rows] = await db_1.pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length)
        throw new Error("User not found");
    const user = rows[0];
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match)
        throw new Error("Invalid password");
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    return { token };
};
exports.login = login;
//# sourceMappingURL=authService.js.map