import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { loginSchema } from './validators/loginValidator';
import AppDataSource from '../config/data-source';
import AppError from '../utils/AppError';

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

  const token = jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });

  return res.json({ token });
};
