import { faker } from '@faker-js/faker';
import request from 'supertest';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import moment from 'moment';
import app from '../app';
import User from '../entities/user/user.model';
import setupTestDB from '../config/setupTestDB';
import { IVoucher } from '../entities/voucher/voucher.interfaces';
import Voucher from '../entities/voucher/voucher.model';
import { tokenService } from '../modules/token';
import tokenTypes from '../modules/token/token.types';

setupTestDB();

const userOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password: 'password1',
  role: 'user',
};

const adminOne = {
  _id: new mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password: 'password1',
  role: 'admin',
};

const voucherOne = {
  _id: new mongoose.Types.ObjectId(),
  code: 'code1',
  userId: userOne._id.toString(),
  discountValue: 10,
  discountType: 'percentage',
  isEnabled: true,
  used: false,
  usedAt: null,
};

const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync('password1', salt);
const accessTokenExpires = moment().add(1000, 'minutes');
const adminAccessToken = tokenService.generateToken(adminOne._id, accessTokenExpires, tokenTypes.ACCESS);
const userAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, tokenTypes.ACCESS);

const insertUsers = async (users: Record<string, any>[]) => {
  await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
};

const insertVouchers = async (vouchers: Record<string, any>[]) => {
  await Voucher.insertMany(vouchers);
};

describe('Vouchers routes', () => {
  describe('POST /v1/vouchers', () => {
    let newVoucher: Partial<IVoucher>;
    beforeEach(() => {
      newVoucher = {
        code: 'abc123',
        userId: userOne._id.toString(),
        description: 'ths is a test voucher',
        discountType: 'percentage',
        discountValue: 10,
      };
    });

    test('should return 200 and successfully create new voucher if request data is ok', async () => {
      await insertUsers([adminOne]);
      const res = await request(app)
        .post('/v1/vouchers')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newVoucher)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        data: {
          code: 'abc123',
          userId: userOne._id.toString(),
          discountType: 'percentage',
          discountValue: 10,
          used: false,
          isEnabled: true,
          id: expect.anything(),
        },
        message: 'voucher created',
      });

      const dbVoucher = await Voucher.findOne({
        userId: userOne._id.toString(),
        code: 'abc123',
      });
      expect(dbVoucher).toBeDefined();
    });

    test('should return 400 error if code is invalid', async () => {
      await insertUsers([adminOne]);
      await request(app)
        .post('/v1/vouchers')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          userId: userOne._id.toString(),
          description: 'ths is a test voucher',
          discountType: 'percentage',
          discountValue: 10,
        })
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /v1/vouchers/generate', () => {
    let generatePayload: any;
    beforeEach(() => {
      generatePayload = {
        userIds: [userOne._id.toString()],
        description: 'ths is a test voucher',
        discountType: 'percentage',
        discountValue: 10,
        quantity: 10,
      };
    });

    test('should return 200 and successfully create new vouchers if request data is ok', async () => {
      await insertUsers([adminOne]);
      const res = await request(app)
        .post('/v1/vouchers/generate')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(generatePayload)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        message: 'Vouchers Generated',
      });

      const dbVouchers = await Voucher.find();
      expect(dbVouchers.length).toEqual(generatePayload.quantity);
    });

    test("should return 400 if the body doesn't contain quantity", async () => {
      await insertUsers([adminOne]);
      await request(app)
        .post('/v1/vouchers/generate')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          userIds: [userOne._id.toString()],
          description: 'ths is a test voucher',
          discountType: 'percentage',
          discountValue: 10,
        })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 if the body doesn't contain userIds", async () => {
      await insertUsers([adminOne]);
      await request(app)
        .post('/v1/vouchers/generate')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          description: 'ths is a test voucher',
          discountType: 'percentage',
          discountValue: 10,
          quantity: 10,
        })
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if the userIds is not array', async () => {
      await insertUsers([adminOne]);
      await request(app)
        .post('/v1/vouchers/generate')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          userIds: userOne._id.toString(),
          description: 'ths is a test voucher',
          discountType: 'percentage',
          discountValue: 10,
          quantity: 10,
        })
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if the discountType is not percentage or numeric', async () => {
      await insertUsers([adminOne]);
      generatePayload.discountType = 'notPercentageOrNumeric';
      await request(app)
        .post('/v1/vouchers/generate')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(generatePayload)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if the discountValue is less than 1', async () => {
      await insertUsers([adminOne]);
      generatePayload.discountValue = 0;
      await request(app)
        .post('/v1/vouchers/generate')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(generatePayload)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if the discountValue is more than 100', async () => {
      await insertUsers([adminOne]);
      generatePayload.discountValue = 101;
      await request(app)
        .post('/v1/vouchers/generate')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(generatePayload)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if the quantity is less than 1', async () => {
      await insertUsers([adminOne]);
      generatePayload.quantity = 0;
      await request(app)
        .post('/v1/vouchers/generate')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(generatePayload)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 if the api is called without authentication token', async () => {
      await insertUsers([adminOne]);
      await request(app).post('/v1/vouchers/generate').send(generatePayload).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 if the api is called with user token', async () => {
      await insertUsers([adminOne]);
      await request(app)
        .post('/v1/vouchers/generate')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(generatePayload)
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /v1/vouchers/redeem', () => {
    let redeemPayload: any;
    beforeEach(() => {
      redeemPayload = {
        userId: userOne._id.toString(),
        code: voucherOne.code,
      };
    });

    test('should return 200 and successfully redeem the voucher', async () => {
      await insertUsers([userOne]);
      await insertVouchers([voucherOne]);
      const res = await request(app)
        .post('/v1/vouchers/redeem')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(redeemPayload)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        message: 'Redeemed Voucher',
      });

      const dbVouchers = await Voucher.findOne({
        userId: userOne._id.toString(),
        code: voucherOne.code,
      });
      expect(dbVouchers).toBeDefined();
      expect(dbVouchers?.used!).toEqual(true);
    });

    test("should return 400 if the body doesn't contain userId", async () => {
      await insertUsers([userOne]);
      await insertVouchers([voucherOne]);
      await request(app)
        .post('/v1/vouchers/redeem')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          code: redeemPayload.code,
        })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 if the body doesn't contain code", async () => {
      await insertUsers([userOne]);
      await insertVouchers([voucherOne]);
      await request(app)
        .post('/v1/vouchers/redeem')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          userId: redeemPayload.userId,
        })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 if the body doesn't contain incorrect code", async () => {
      await insertUsers([userOne]);
      await insertVouchers([voucherOne]);
      redeemPayload.code = 'incorrectcode';
      await request(app)
        .post('/v1/vouchers/redeem')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(redeemPayload)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if the code is already used', async () => {
      await insertUsers([userOne]);
      voucherOne.used = true;
      await insertVouchers([voucherOne]);
      await request(app)
        .post('/v1/vouchers/redeem')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(redeemPayload)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 if the code is non enabled code', async () => {
      await insertUsers([userOne]);
      voucherOne.isEnabled = false;
      await insertVouchers([voucherOne]);
      await request(app)
        .post('/v1/vouchers/redeem')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(redeemPayload)
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 if the api is called without authentication token', async () => {
      await insertUsers([userOne]);
      await insertVouchers([voucherOne]);
      await request(app).post('/v1/vouchers/redeem').send(redeemPayload).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 if the api is called with admin token', async () => {
      await insertUsers([userOne]);
      await insertVouchers([voucherOne]);
      await insertUsers([adminOne]);
      await request(app)
        .post('/v1/vouchers/redeem')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(redeemPayload)
        .expect(httpStatus.FORBIDDEN);
    });
  });
});
