import { Model, Document } from 'mongoose';
import { QueryResult } from '../../database/plugins/paginate/paginate';

export interface IVoucher {
  code: String;
  description: String;
  discountValue: Number;
  discountType: String;
  isEnabled: Boolean;
  userId: String;
  used: Boolean;
  usedAt: Date | null;
  expires: Date | null;
}

export interface IVoucherDoc extends IVoucher, Document {}

export interface IVoucherModel extends Model<IVoucherDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
