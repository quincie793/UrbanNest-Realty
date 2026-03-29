"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const JWT_SECRET = "your_secret_key"; // later move to .env
// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER"
            },
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Registration failed" });
    }
};
exports.register = register;
// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ error: "Invalid password" });
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            role: user.role // 👈 ADD THIS
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user });
    }
    catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
};
exports.login = login;
