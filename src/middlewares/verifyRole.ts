import { Request, Response, NextFunction } from 'express';

export const verifyRole = (allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user; // TypeScript giờ đây nhận biết req.user là kiểu IAccount
    if (!user) {
      // Chuyển hướng hoặc render trang Unauthorized
      return res.status(401).render('pages/Forbiddenpage/forbiddenPage', { message: 'Unauthorized' });
    }
    if (!allowedRoles.includes(user.role)) {
      // Chuyển hướng hoặc render trang Forbidden
      return res.status(403).render('pages/ForbiddenPage/forbiddenPage', { message: 'Forbidden' });
    }
    next();
  };
};
