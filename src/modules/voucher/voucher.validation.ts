import Joi from 'joi';
import { objectId } from '../../validators';

export const getVoucher = {
  params: Joi.object()
    .required()
    .keys({
      id: Joi.string().custom(objectId).required(),
    }),
};
export const createVoucher = {
  body: {
    code: Joi.string().required(),
    userId: Joi.string().required(),
    description: Joi.string().required(),
    discountValue: Joi.number().min(1).max(100).required(),
    discountType: Joi.string().required().valid('numeric', 'percentage'),
    isEnabled: Joi.boolean().optional(),
  },
};

export const updateVoucher = {
  params: Joi.object()
    .required()
    .keys({
      userId: Joi.string().custom(objectId).required(),
    }),
  body: {
    code: Joi.string().optional(),
    userId: Joi.string().optional(),
    description: Joi.string().optional(),
    discountValue: Joi.number().min(1).max(100).optional(),
    discountType: Joi.string().optional().valid('numeric', 'percentage'),
    isEnabled: Joi.boolean().optional(),
  },
};

export const deleteVoucher = {
  params: Joi.object()
    .required()
    .keys({
      userId: Joi.string().custom(objectId).required(),
    }),
};

export const generateVoucher = {
  body: {
    quantity: Joi.number().min(1).required(),
    userIds: Joi.array().items(Joi.string()).min(1).required(),
    description: Joi.string().required(),
    discountValue: Joi.number().min(1).max(100).required(),
    discountType: Joi.string().required().valid('numeric', 'percentage'),
    isEnabled: Joi.boolean().optional(),
  },
};

export const useVoucher = {
  body: {
    code: Joi.string().required(),
    userId: Joi.string().required(),
  },
};
