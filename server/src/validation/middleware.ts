import { type NextFunction, type Request, type Response } from "express";
import { ZodError, type ZodType } from "zod";

export const validate =
  (schema: ZodType<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          error: "Validation failed",
          details: errors,
        });
      }

      return res.status(400).json({
        error: "Validation failed",
        details: [
          { field: "validation", message: error.message || "Invalid input" },
        ],
      });
    }
  };

