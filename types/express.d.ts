import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload; // Adjust the type based on JWT payload
    }
  }
}
