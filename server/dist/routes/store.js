"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../auth");
const services_1 = require("../services");
const auth_2 = require("../utils/auth");
const router = (0, express_1.Router)();
// Public route to get store information
router.get("/", async (req, res) => {
    if (!req.currentStore) {
        return res.status(404).json({ error: "Store not found" });
    }
    res.json({
        id: req.currentStore.id,
        name: req.currentStore.name,
        slug: req.currentStore.slug,
        welcome_message: req.currentStore.welcome_message,
    });
});
router.post("/signup", async (req, res) => {
    if (!req.currentStore) {
        return res.status(404).json({ error: "Store not found" });
    }
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const user = await services_1.userService.createUser(email, password, req.currentStore.id);
        const token = (0, auth_2.generateToken)(user.id, user.store_id);
        res.status(201).json({
            message: "User created successfully",
            token,
            user: { id: user.id, email: user.email, store_id: user.store_id },
        });
    }
    catch (error) {
        //duplicate email error
        if (error.code === "23505") {
            return res
                .status(409)
                .json({ error: "Email already exists in this store" });
        }
        res.status(500).json({ error: "Failed to create user" });
    }
});
// Login route for the current store
router.post("/login", async (req, res) => {
    if (!req.currentStore) {
        return res.status(404).json({ error: "Store not found" });
    }
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    try {
        const user = await services_1.userService.getUserByEmailAndStore(email, req.currentStore.id);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = (0, auth_2.generateToken)(user.id, user.store_id);
        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, email: user.email, store_id: user.store_id },
        });
    }
    catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});
// Protected route example - only authenticated users from the current store can access
router.get("/profile", auth_1.authenticateUser, async (req, res) => {
    if (!req.userId || !req.storeId) {
        return res.status(401).json({ error: "Authentication required" });
    }
    try {
        const user = await services_1.userService.getUserByIdAndStore(req.userId, req.storeId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({
            id: user.id,
            email: user.email,
            store_id: user.store_id,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch user profile" });
    }
});
exports.default = router;
