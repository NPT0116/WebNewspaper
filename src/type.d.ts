import { IUser } from './interfaces/userInterface.ts';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
