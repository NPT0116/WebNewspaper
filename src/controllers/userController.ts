// src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/userSchema.js'
import { AppError } from '../utils/appError.js'
import passport from 'passport'
import { IUser } from '~/interfaces/userInterface.js'

interface IUserRegister {
  username: string
  password: string
  email: string
}
// Đăng ký người dùng
export const registerUser = async (req: Request<{}, {}, IUserRegister>, res: Response, next: NextFunction) => {
  const { username, password, email } = req.body
  try {
    const existingUser: IUser | null = await User.findOne({
      $or: [{ username }, { email }]
    })
    if (existingUser) {
      return next(
        new AppError('Username or email already exists', 404, [{ param: 'username or email', msg: 'already exists' }])
      )
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ email, username, password: hashedPassword })
    await newUser.save()
    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    next(new AppError("Can't register user", 500))
  }
}

// Đăng nhập người dùng
export const loginUser = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
})

// Đăng xuất người dùng
export const logoutUser = (req: Request, res: Response) => {
  let a
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' })
    }
    res.clearCookie('connect.sid')
    res.status(200).json({ message: 'Logout successful' })
  })
}
