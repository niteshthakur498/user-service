// src/controllers/userController.ts

import { Request, Response, NextFunction } from 'express';
import  AppDataSource  from '../config/data-source';
import { User } from '../Entities/User';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError';
import { registerSchema } from './validators/userValidator';
require('dotenv').config({path: __dirname + '/../.env'})
const DATABASE_URL = process.env.DATABASE_URI;

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const userRepository = AppDataSource.getRepository(User);
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: [{ email }, { username }]
    });
    if (existingUser) {
      return next(new AppError('Email or Username already in use', 400));
    }

    // Hash the password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = userRepository.create({
      username,
      email,
      passwordHash: hashedPassword
    });

    await userRepository.save(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err instanceof Error) {
      next(new AppError('Error registering user', 500, err));
    } else {
      next(new AppError('An unexpected error occurred', 500));
    }
  }
};


// export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userRepository = AppDataSource.getRepository(User);
//     const userId = req.params.id;
//     const { username, email } = req.body;

//     const user = await userRepository.findOneBy({ userId: Number(userId) });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     user.username = username;
//     user.email = email;

//     await userRepository.save(user);
//     res.status(200).json({ message: 'Profile updated successfully' });
//   } catch (error) {
//     next(new AppError('Error registering user', 500));
//   }
// };

