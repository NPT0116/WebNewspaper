import { Request, Response } from 'express';

export const getDashboardPage = (req: Request, res: Response) => {
  res.render('layouts/DashboardLayout/DashboardLayout', {
    body: '../../pages/DashboardPages/DashboardPage'
  });
};
