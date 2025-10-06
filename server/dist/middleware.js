"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractStoreFromSubdomain = extractStoreFromSubdomain;
const services_1 = require("./services");
async function extractStoreFromSubdomain(req, res, next) {
    // Extract store from subdomain: a.localhost:3000, b.localhost:3000, etc.
    const host = req.get("Host") || "";
    const subdomain = host.split(".")[0];
    // Check if we're dealing with a subdomain (not just localhost:3000)
    if (subdomain && subdomain !== "localhost" && subdomain !== "api") {
        const store = await services_1.storeService.getStoreBySlug(subdomain);
        if (store) {
            req.currentStore = store;
        }
    }
    next();
}
