import { NextFunction, Request, Response } from 'express';
import { UserProfile } from '../entities/UserProfile';
import { User } from '../entities/User';
import { profileSchema } from './validators/profileValidator';
import AppError from '../utils/AppError';
import AppDataSource from '../config/data-source';

export const updateProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = profileSchema.validate(req.body);

  if (error) {
    return next(new AppError(error.details[0].message, 402));
  }

  const userRepository = AppDataSource.getRepository(User);
  const userProfileRepository = AppDataSource.getRepository(UserProfile);

  const user = await userRepository.findOne({where:{userId:(req as any).user.userId}});

  if (!user) {
    return next(new AppError('User Not Found', 404));
  }

  let userProfile = await userProfileRepository.findOne({ where: { userId: user.userId } });

  if (!userProfile) {
    userProfile = userProfileRepository.create({
        userId: user.userId,
        country: 'IND',
        income: 0
      });
  }

  userProfile.country = req.body.country;
  userProfile.currency = req.body.currency;
  userProfile.income = req.body.income || 0;


  await userProfileRepository.save(userProfile);

  return res.status(201).json({ message: 'Profile updated successfully', profile: userProfile });
};
