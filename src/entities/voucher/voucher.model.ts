import mongoose from 'mongoose';
import toJSON from '../../database/plugins/toJSON/toJSON';
import paginate from '../../database/plugins/paginate/paginate';
import { IVoucherDoc, IVoucherModel } from './voucher.interfaces';
import voucherTypes from '../../modules/voucher/voucher.types';

const voucherSchema = new mongoose.Schema<IVoucherDoc, IVoucherModel>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    discountType: {
      type: String,
      enum: [voucherTypes.NUMERIC, voucherTypes.PERCENTAGE],
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: true,
      required: true,
    },
    usedAt: {
      type: Date,
      required: false,
    },
    used: {
      type: Boolean,
      default: false,
      required: true,
    },
    expires: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
voucherSchema.plugin(toJSON);
voucherSchema.plugin(paginate);

const Voucher = mongoose.model<IVoucherDoc, IVoucherModel>('Voucher', voucherSchema);

export default Voucher;
