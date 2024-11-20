import { Request, Response, NextFunction } from 'express';
import { IAccount } from '~/interfaces/Account/accountInterface.js';

export const verifyRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IAccount;
      if (!user) {
        res.status(401).json({ message: 'Do not have any user' });
        return;
      }
      const userRole = user.role;
      if (!allowedRoles.includes(userRole)) {
        res.status(403).json({ message: 'No permission' });
        return;
      }
      next();
    } catch (error) {
      console.error('Error in verifyRole middleware:', error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  };
};
