// src/controllers/userController.ts

import { Request, Response, NextFunction } from 'express';
import  AppDataSource  from '../config/data-source';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError';
import { registerSchema } from './validators/userValidator';
import { UserProfile } from '../entities/UserProfile';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 401));
    }

    const userRepository = AppDataSource.getRepository(User);
    const userProfileRepository = AppDataSource.getRepository(UserProfile);
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: [{ email }, { username }]
    });
    if (existingUser) {
      return next(new AppError('Conflict - User already exists with the provided Username/Email', 402));
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


    const savedUser = await userRepository.save(newUser);

    const userProfile = userProfileRepository.create({
      userId: savedUser.userId,
      country: 'IND',
      income: 0
    });

    await userProfileRepository.save(userProfile);

    res.status(201).json({ message: 'User Registered Successfully' });
    
  } catch (err) {
    if (err instanceof Error) {
      next(new AppError('Error registering user', 500, err));
    } else {
      next(new AppError('Error registering user', 500));
    }
  }
};


export const deactivateUserController = async (req: Request, res: Response, next: NextFunction) => {

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({where:{userId:(req as any).user.userId}});

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.userStatus = 'D';

  await userRepository.save(user);

  return res.status(201).json({ 
    message:"User Deactivated Successfully.."
   });
};


