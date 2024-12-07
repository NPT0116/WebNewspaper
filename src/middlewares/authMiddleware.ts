import { Request, Response, NextFunction } from 'express';
import { getProfile } from '~/controllers/landingpage/landingpageController.js';
export const attAccountToView = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.isAuthenticated() && req.user) {
      const profile = await getProfile(req.user._id);
      res.locals.isAuthenticated = true; // Đã đăng nhập
      res.locals.profile = profile; // Gắn profile của người dùng
      console.log(res.locals);
    } else {
      res.locals.isAuthenticated = false; // Không đăng nhập
      res.locals.profile = null; // Không có profile
      console.log(res.locals);
    }
    next();
  } catch (error) {
    console.error('Error attaching user to views:', error);
    res.locals.isAuthenticated = false;
    res.locals.profile = null;
    next(); // Không chặn request dù xảy ra lỗi
  }
};
