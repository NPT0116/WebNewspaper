import { IAccount } from '~/interfaces/Account/accountInterface.js';

declare global {
  namespace Express {
    interface User extends IAccount {} // Kế thừa từ IAccount
    interface Request {
      user?: IAccount; // Đảm bảo TypeScript nhận biết req.user
    }
  }
}
