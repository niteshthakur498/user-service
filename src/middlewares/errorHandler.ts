// src/middlewares/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
  });
};

export default errorHandler;
