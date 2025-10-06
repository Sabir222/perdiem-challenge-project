"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = authenticateUser;
const auth_1 = require("./utils/auth");
async function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authentication token required" });
    }
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const tokenData = (0, auth_1.verifyToken)(token);
    if (!tokenData) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
    // Verify that the user belongs to the current store
    if (req.currentStore && tokenData.storeId !== req.currentStore.id) {
        return res
            .status(403)
            .json({ error: "Access denied: User does not belong to this store" });
    }
    // Add user info to request
    req.userId = tokenData.userId;
    req.storeId = tokenData.storeId;
    next();
}
