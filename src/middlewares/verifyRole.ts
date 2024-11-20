import { Request, Response, NextFunction } from 'express';

export const verifyRole = (allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user; // TypeScript giờ đây nhận biết req.user là kiểu IAccount
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    next();
  };
};
