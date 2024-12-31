// src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { AppError } from '../../utils/appError.js';
import passport from 'passport';
import { Account } from '~/models/Account/accountSchema.js';
import { ReaderProfile } from '~/models/Profile/readerProfile.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { IReaderProfile } from '~/interfaces/Profile/profileBaseInterface.js';
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
export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) {
      return next(err); // Handle any errors during authentication
    }
    if (!user) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/login'); // Redirect if authentication fails
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr); // Handle login errors
      }

      // Check user role and redirect accordingly
      if (user.role === 'admin') {
        res.redirect('/dashboard/admin'); // Redirect admins or editors to the dashboard
      } else if (user.role === 'editor') {
        res.redirect('/dashboard/editor'); // Redirect admins or editors to the dashboard
      } else if (user.role === 'reporter') {
        res.redirect('/dashboard/reporter'); // Redirect admins or editors to the dashboard
      } else {
        res.redirect('/'); // Default redirect for other roles
      }
    });
  })(req, res, next);
};

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

// Cấu hình transporter cho Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'huy37204@gmail.com',
    pass: 'gaxy ytny gfhc hkni'
  }
});

// Hàm gửi OTP qua email
export const sendOtp = async (email: string, name: string): Promise<string> => {
  const otp = crypto.randomInt(100000, 999999); // Tạo OTP ngẫu nhiên 6 chữ số

  const mailOptions = {
    from: 'huy37204@gmail.com',
    to: email,
    subject: 'Reset your password',
    html: `
      <p>Dear ${name},</p>
      <p>We have received a request to reset the password associated with your account (${email}).</p>
      <p>If you did not request this, please ignore this email. Otherwise, use the OTP below to reset your password:</p>
      <h2>${otp}</h2>
      <p>Please note that this OTP is valid for a limited time only.</p>
      <br>
      <p>Thank you,</p>
      <p><strong>Newspaper Team</strong></p>
    `
  };

  try {
    // Gửi email
    await transporter.sendMail(mailOptions);
    return otp.toString();
  } catch (error) {
    const err = error as Error;
    throw new Error('Error sending OTP email: ' + err.message);
  }
};

// Hàm xử lý yêu cầu gửi OTP để đổi mật khẩu
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email || email.trim().length === 0) {
    req.flash('error', 'Email is required');
    res.redirect('/login/forgot-password');
    return;
  }
  const account = await Account.findOne({ email: email.trim() }).populate<{ profileId: IReaderProfile }>('profileId');

  if (!account) {
    req.flash('error', 'Incorrect email');
    res.redirect('/login/forgot-password');
    return;
  }

  try {
    const otp = await sendOtp(email, account.profileId?.name || 'User');
    account.resetOtp = otp;
    await account.save();
    res.redirect('/login/forgot-password/verify?email=' + email);
  } catch (error) {
    req.flash('error', 'Error sending OTP email');
    res.redirect('/login/forgot-password');
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  if (!otp) {
    req.flash('error', 'OTP is required');
    res.redirect('/login/forgot-password/verify?email=' + email);
    return;
  }

  try {
    // Tìm tài khoản theo email
    const account = await Account.findOne({ email });

    if (!account) {
      res.status(400).send('Account not found');
      return;
    }

    // Kiểm tra OTP
    if (account.resetOtp !== otp) {
      req.flash('error', 'Incorrect OTP');
      res.redirect('/login/forgot-password/verify?email=' + email);
      return;
    }

    // Xóa OTP khỏi tài khoản sau khi xác minh thành công
    account.resetOtp = '';
    await account.save();

    // Chuyển hướng tới trang đặt lại mật khẩu với email
    res.redirect(`/login/forgot-password/reset?email=${email}`);
  } catch (error) {
    console.error(error);
    res.render('authentication/forgotPasswordVerify', {
      email,
      errorMessage: 'An error occurred. Please try again later.'
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, newPassword } = req.body; // Dùng req.body thay vì req.query

  if (!newPassword) {
    req.flash('error', 'New password is required');
    res.redirect('/login/forgot-password/reset?email=' + email);
    return;
  }

  // Tìm tài khoản theo email
  const account = await Account.findOne({ email });

  if (!account) {
    res.status(404).send('Account not found');
    return;
  }

  if (newPassword.length < 6) {
    req.flash('error', 'Password must be at least 6 character length');
    res.redirect('/login/forgot-password/reset?email=' + email);
    return;
  }

  // Mã hóa mật khẩu mới
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  if (!account.localAuth) {
    res.status(400).send('Local authentication data is missing');
    return;
  }

  // Cập nhật mật khẩu mới và xóa OTP
  account.localAuth.password = hashedPassword;
  account.resetOtp = ''; // Xóa OTP sau khi sử dụng

  await account.save();

  req.flash('success', 'Password has been updated successfully');

  res.redirect('/login');
};
export const loginGithub = passport.authenticate('github', { scope: ['user:email'] });

export const githubCallbackFunction = passport.authenticate('github', { failureRedirect: '/login', failureFlash: true });

export const githubLoginSuccess = (req: Request, res: Response, next: NextFunction) => {
  req.flash('success', 'Successfully logged in with GitHub');
  res.redirect('/');
};
