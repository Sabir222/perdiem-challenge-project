"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const middleware_1 = require("./middleware");
const store_1 = __importDefault(require("./routes/store"));
const client_1 = __importDefault(require("./redis/client"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "4000");
client_1.default.connect();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(middleware_1.extractStoreFromSubdomain);
app.use("/", store_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
