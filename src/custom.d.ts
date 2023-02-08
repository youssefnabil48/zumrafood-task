import { IUserDoc } from './entities/user/user.interfaces';

declare module 'express-serve-static-core' {
  export interface Request {
    user: IUserDoc;
  }
}
