import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { loginSchema } from './validators/loginValidator';
import AppDataSource from '../config/data-source';
import AppError from '../utils/AppError';
import { v4 as uuidv4 } from 'uuid';

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email: req.body.email } });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!isPasswordValid) {
    return next(new AppError('Invalid password', 401));
  }

  const accessToken = jwt.sign(
    { userId: user.userId, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = uuidv4();
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds);
  // Set the expiration date for the refresh token
  const REFRESH_TOKEN_EXPIRY_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '10', 10);
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  
  user.refreshToken = hashedRefreshToken;
  user.refreshTokenExpiry = refreshTokenExpiry;

  await userRepository.save(user);

  return res.json({ 
    accessToken,
    refreshToken,
    accessTokenExpiresIn: 3600, // 1 hour in seconds
    refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60, // 30 days in seconds
   });
};

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken,email } = req.body;

  if (!refreshToken) {
    return next(new AppError('Refresh token is required', 400));
  }

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email: email } });

  if (!user) {
    return next(new AppError('User Not Found', 403));
  }

  const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!isRefreshTokenValid) {
    return next(new AppError('Invalid refresh token', 403));
  }

  // Check if the refresh token is expired
  if (new Date() > user.refreshTokenExpiry) {
    return next(new AppError('Refresh token is expired', 403));
  }

  const newAccessToken = jwt.sign(
    { userId: user.userId, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );


  const newRefreshToken = uuidv4();
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  const hashedRefreshToken = await bcrypt.hash(newRefreshToken, saltRounds);
  // Set the expiration date for the refresh token
  const REFRESH_TOKEN_EXPIRY_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '10', 10);
  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  
  user.refreshToken = hashedRefreshToken;
  user.refreshTokenExpiry = refreshTokenExpiry;

  await userRepository.save(user);

  return res.json({ 
    accessToken: newAccessToken,
    refreshToken : newRefreshToken,
    accessTokenExpiresIn: 3600, // 1 hour in seconds
    refreshTokenExpiresIn: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60, // 30 days in seconds
   });

};

