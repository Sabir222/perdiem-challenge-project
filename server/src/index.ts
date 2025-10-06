import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { extractStoreFromSubdomain } from "./middleware";
import storeRoutes from "./routes/store";
import redisClient from "./redis/client";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "4000");

redisClient.connect();

app.use(cors());
app.use(express.json());

app.use(extractStoreFromSubdomain);

app.use("/", storeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
