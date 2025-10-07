import { Request, Response, NextFunction } from "express";
import { storeService } from "./services";

export async function extractStoreFromSubdomain(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const host = req.get("Host") || "";
  const subdomain = host.split(".")[0];

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
