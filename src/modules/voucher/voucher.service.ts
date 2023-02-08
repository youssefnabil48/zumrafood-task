import { injectable } from 'inversify';
import { IVoucher } from '../../entities/voucher/voucher.interfaces';
import Voucher from '../../entities/voucher/voucher.model';
import { generateMixedCaseTokenArray } from '../../utils';
import VoucherConfig from '../../config/voucher';
import { ApiError } from '../../errors';

@injectable()
export default class VoucherService {
  /**
   *
   * @returns
   * @param id
   */
  public async get(id: string): Promise<IVoucher> {
    const voucher = await Voucher.findOne({ _id: id });
    if (!voucher) {
      throw new ApiError(404, 'Voucher not found');
    }
    return voucher;
  }

  /**
   *
   * @param voucherBody
   * @returns
   */
  public async create(voucherBody: IVoucher): Promise<IVoucher> {
    return Voucher.create(voucherBody);
  }

  /**
   *
   * @param id
   * @param voucherBody
   */
  public async update(id: string, voucherBody: IVoucher) {
    return Voucher.updateOne({ _id: id }, voucherBody);
  }

  /**
   *
   * @param id
   */
  public async delete(id: string) {
    return Voucher.deleteOne({ _id: id });
  }

  /**
   *
   * @param quantity
   * @param userIds
   * @param voucherInfo
   */
  public async generateVouchersForMany(quantity: number, userIds: Array<string>, voucherInfo: Partial<IVoucher>) {
    const vouchersPromises: Array<Promise<any>> = [];
    userIds.forEach((userId) => {
      vouchersPromises.push(this.generateVouchers(quantity, { userId, ...voucherInfo }));
    });
    await Promise.all(vouchersPromises);
  }

  /**
   *
   * @param voucherInfo
   * @param quantity
   */
  public async generateVouchers(quantity: number, voucherInfo: Partial<IVoucher>) {
    const codesArr = generateMixedCaseTokenArray(quantity, VoucherConfig.DEFAULT_VOUCHER_LENGTH);
    const codes = codesArr.map((code) => {
      return {
        code,
        ...voucherInfo,
      };
    });
    await Voucher.create(codes);
  }

  /**
   *
   * @param code
   * @param userId
   */
  public async redeemVoucher(code: string, userId: string) {
    const voucher = await Voucher.findOne({ code, userId, isEnabled: true });
    if (!voucher) {
      throw new ApiError(400, 'Unable to use voucher');
    }
    if (voucher.used) {
      throw new ApiError(403, 'Voucher is used before');
    }
    await Voucher.updateOne(
      { _id: voucher._id },
      {
        $set: {
          used: true,
          usedAt: Date.now(),
        },
      }
    );
  }
}
