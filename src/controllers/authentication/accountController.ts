// src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { AppError } from '../../utils/appError.js';
import passport from 'passport';
import { Account } from '~/models/Account/accountSchema.js';
import { ReaderProfile } from '~/models/Profile/readerProfile.js';

import mongoose from 'mongoose';
interface IAccountRegister {
  username: string;
  password: string;
  email: string;
  dob: Date;
  name: string;
  gender: 'male' | 'female' | 'other' | null;
}
// Đăng ký người dùng
export const registerUser = async (req: Request<{}, {}, IAccountRegister>, res: Response, next: NextFunction) => {
  const { username, password, email, dob, name, gender } = req.body;
  try {
    const existingUser = await Account.findOne({
      $or: [{ 'localAuth.username': username }, { email }]
    });
    if (existingUser) {
      req.flash('error', 'Username or email already exists.');
      return res.redirect('/register'); // Quay lại trang đăng ký
      /* return next(new AppError('Username or email exists.', 404, [{ param: 'username or email', msg: 'Already exists' }]));*/
    }
    const newProfile = new ReaderProfile({ name, dob, gender });
    const savedProfile = await newProfile.save();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newAccount = new Account({
      localAuth: {
        username,
        password: hashedPassword
      },
      profileType: 'ReaderProfile',
      email,
      role: 'reader',
      isSubscriber: false,
      profileId: savedProfile._id
    });

    const savedAccount = await newAccount.save();

    savedProfile.accountId = savedAccount._id as mongoose.Types.ObjectId;
    await savedProfile.save();

    // res.status(201).json({ message: 'User registered successfully' });

    res.redirect('/login');
  } catch (error) {
    console.log(error);

    next(new AppError('Error happen when register account', 500));
  }
};

// Đăng nhập người dùng
export const loginUser = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
});

// Đăng xuất người dùng
export const logoutUser = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};

export const loginGithub = passport.authenticate('github', { scope: ['user:email'] });

export const githubCallbackFunction = passport.authenticate('github', { failureRedirect: '/login', failureFlash: true });

export const githubLoginSuccess = (req: Request, res: Response, next: NextFunction) => {
  req.flash('success', 'Successfully logged in with GitHub');
  res.redirect('/');
};
