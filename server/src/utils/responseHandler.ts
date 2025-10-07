import { type Response } from "express";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: string;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string,
  code: string,
  statusCode: number = 500,
  message?: string,
): Response => {
  const response: ApiResponse = {
    success: false,
    error,
    code,
    message,
  };

  return res.status(statusCode).json(response);
};

export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};