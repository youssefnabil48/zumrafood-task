import express, { Router } from 'express';
import { VoucherController, VoucherValidation } from '../../modules/voucher';
import { validate } from '../../validators';
import catchAsync from '../../utils/catchAsync';
import container from '../../config/inversify.config';
import TYPES from '../../types/inversify';
import { auth } from '../../modules/auth';

const router: Router = express.Router();

router
  .route('/')
  .post(
    auth('manageVouchers'),
    validate(VoucherValidation.createVoucher),
    catchAsync(container.get<VoucherController>(TYPES.VoucherController).create)
  );
router
  .route('/:id')
  .get(
    auth('manageVouchers'),
    validate(VoucherValidation.getVoucher),
    catchAsync(container.get<VoucherController>(TYPES.VoucherController).get)
  )
  .put(
    auth('manageVouchers'),
    validate(VoucherValidation.updateVoucher),
    catchAsync(container.get<VoucherController>(TYPES.VoucherController).update)
  )
  .delete(
    auth('manageVouchers'),
    validate(VoucherValidation.deleteVoucher),
    catchAsync(container.get<VoucherController>(TYPES.VoucherController).delete)
  );
router.post(
  '/generate',
  auth('manageVouchers'),
  validate(VoucherValidation.generateVoucher),
  catchAsync(container.get<VoucherController>(TYPES.VoucherController).generateVouchers)
);
router.post(
  '/redeem',
  auth('redeemVoucher'),
  validate(VoucherValidation.useVoucher),
  catchAsync(container.get<VoucherController>(TYPES.VoucherController).redeemVoucher)
);

export default router;
/**
 * @swagger
 * tags:
 *   name: Vouchers
 *   description: Vouchers Api Documentation
 */

/**
 * @swagger
 * /vouchers:
 *   post:
 *     summary: Create new Voucher
 *     tags: [Vouchers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - description
 *               - customerId
 *               - discountType
 *               - discountValue
 *             properties:
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *                 description: the description of the voucher
 *               userId:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 description: Must be "numeric", "percentage
 *               discountValue:
 *                 type: number
 *                 description: Value of the discount
 *             example:
 *               code: UwwFN
 *               description: this is first code
 *               userId: 63df11e229db5e24747dc358
 *               discountValue: 10
 *               discountType: percentage
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: voucher
 *                 data:
 *                   $ref: '#/components/schemas/Voucher'
 *       "400":
 *         $ref: '#/components/responses/Validation'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /vouchers/{id}:
 *   get:
 *     summary: Get single Voucher
 *     tags: [Vouchers]
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: string ID of the voucher to update
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: voucher created
 *                 data:
 *                   $ref: '#/components/schemas/Voucher'
 *       "400":
 *         $ref: '#/components/responses/Validation'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /vouchers/{id}:
 *   put:
 *     summary: Update Existing Voucher
 *     tags: [Vouchers]
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: string ID of the voucher to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *                 description: the description of the voucher
 *               userId:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 description: Must be "numeric", "percentage
 *               discountValue:
 *                 type: number
 *                 description: Value of the discount
 *             example:
 *               code: UwwFN
 *               description: this is first code
 *               userId: 63df11e229db5e24747dc358
 *               discountValue: 10
 *               discountType: percentage
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Updated
 *       "400":
 *         $ref: '#/components/responses/Validation'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /vouchers/{id}:
 *   delete:
 *     summary: Delete single Voucher
 *     tags: [Vouchers]
 *     parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: string ID of the voucher to update
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: deleted
 *       "400":
 *         $ref: '#/components/responses/Validation'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /vouchers/generate:
 *   post:
 *     summary: Generate new Vouchers for single/multiple users
 *     tags: [Vouchers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *               - description
 *               - userIds
 *               - discountType
 *               - discountValue
 *             properties:
 *               quantity:
 *                 type: number
 *               description:
 *                 type: string
 *                 description: the description of the voucher
 *               userIds:
 *                 type: array
 *               discountType:
 *                 type: string
 *                 description: Must be "numeric", "percentage
 *               discountValue:
 *                 type: number
 *                 description: Value of the discount
 *             example:
 *               quantity: 1
 *               description: this is first code
 *               userIds: [63df11e229db5e24747dc358]
 *               discountValue: 10
 *               discountType: percentage
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: generated
 *       "400":
 *         $ref: '#/components/responses/Validation'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /vouchers/redeem:
 *   post:
 *     summary: Redeem a voucher
 *     tags: [Vouchers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - userId
 *             properties:
 *               code:
 *                 type: string
 *               userId:
 *                 type: string
 *             example:
 *               code: UwwFN
 *               userId: 63df11e229db5e24747dc358
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: redeemed
 *       "400":
 *         $ref: '#/components/responses/Validation'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
