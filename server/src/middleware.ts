import { Request, Response, NextFunction } from "express";
import { storeService } from "./services";

export async function extractStoreFromSubdomain(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Extract store from subdomain: a.localhost:3000, b.localhost:3000, etc.
  const host = req.get("Host") || "";
  const subdomain = host.split(".")[0];

  // Check if we're dealing with a subdomain (not just localhost:3000)
  if (subdomain && subdomain !== "localhost" && subdomain !== "api") {
    const store = await storeService.getStoreBySlug(subdomain);
    if (store) {
      req.currentStore = store;
    }
  }

  next();
}

declare global {
  namespace Express {
    interface Request {
      currentStore?: import("./models").Store;
    }
  }
}
