import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';

interface DecodedToken {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("Entered Here....");
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return next(new AppError("Invalid authorization header", 401));
  } 

  const token = authorizationHeader.replace("Bearer ", "");

  if (!token) {
    return next(new AppError("Authorization Token not found", 401));
  }

  try {
    /*const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    req.body.user = {
      id: decoded.userId,
      email: decoded.email,
    };*/

    const decoded = jwt.verify(token, (process.env as any).JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return next(new AppError("Invalid Token", 401, error as Error));
  }
};
