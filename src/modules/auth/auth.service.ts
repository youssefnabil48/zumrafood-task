import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { getUserByEmail } from '../user/user.service';
import { IUserDoc } from '../../entities/user/user.interfaces';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
// eslint-disable-next-line import/prefer-default-export
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUserDoc> => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};
