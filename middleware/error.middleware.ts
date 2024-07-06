import type { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the stack trace for debugging purposes
  console.error(err.stack);
  // Send error response to the client
  res.status(500).json({ message: err.message });
};

export default errorHandler;
