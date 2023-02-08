import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import httpStatus from 'http-status';
import VoucherService from './voucher.service';
import pick from '../../utils/pick';
import TYPES from '../../types/inversify';

@injectable()
export default class VoucherController {
  private voucherService: VoucherService;

  /**
   *
   * @param voucherService
   */
  constructor(@inject(TYPES.VoucherService) voucherService: VoucherService) {
    this.voucherService = voucherService;
    /**
     * Disclaimer
     * The following code (binding the functions to this) should not exist but this was a workaround for Inversify package conflict
     * with typescript compilation "module".
     */
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.generateVouchers = this.generateVouchers.bind(this);
    this.redeemVoucher = this.redeemVoucher.bind(this);
  }

  /**
   *
   * @param request
   * @param response
   */
  public async get(request: Request, response: Response) {
    const params = pick(request.params, ['id']);
    const voucher = await this.voucherService.get(params.id);
    return response.status(httpStatus.OK).json({
      message: 'voucher',
      data: voucher,
    });
  }

  /**
   *
   * @param request
   * @param response
   */
  public async create(request: Request, response: Response) {
    const voucher = await this.voucherService.create(request.body);
    return response.status(httpStatus.OK).json({
      message: 'voucher created',
      data: voucher,
    });
  }

  /**
   *
   * @param request
   * @param response
   */
  public async update(request: Request, response: Response) {
    const params = pick(request.params, ['id']);
    await this.voucherService.update(params.id, request.body);
    return response.status(httpStatus.OK).json({
      message: 'voucher updated',
    });
  }

  /**
   *
   * @param request
   * @param response
   */
  public async delete(request: Request, response: Response) {
    const params = pick(request.params, ['id']);
    await this.voucherService.delete(params.id);
    return response.status(httpStatus.OK).json({
      message: 'deleted',
    });
  }

  /**
   *
   * @param request
   * @param response
   */
  public async generateVouchers(request: Request, response: Response) {
    const { quantity, userIds, ...voucher } = request.body;
    await this.voucherService.generateVouchersForMany(quantity, userIds, voucher);
    return response.status(httpStatus.OK).json({ message: 'Vouchers Generated' });
  }

  /**
   *
   * @param request
   * @param response
   */
  public async redeemVoucher(request: Request, response: Response) {
    const { code, userId } = request.body;
    await this.voucherService.redeemVoucher(code, userId);
    return response.status(httpStatus.OK).json({ message: 'Redeemed Voucher' });
  }
}
