// import { Request, Response, NextFunction } from 'express';

// export const redirectIfLogin = (req: Request, res: Response, next: NextFunction) => {
//   console.log(req.isAuthenticated());
//   if (req.isAuthenticated()) {
//     console.log('User is authenticated');

//     if (req.user.role === 'admin') res.redirect('/dashboard/admin');
//     else if (req.user.role === 'editor') res.redirect('/dashboard/editor');
//     else if (req.user.role === 'reporter') res.redirect('/dashboard/reporter');
//     else res.redirect('/');
//   } else {
//     next();
//   }
// };
