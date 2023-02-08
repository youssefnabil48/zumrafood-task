import { Container } from 'inversify';
import TYPES from '../types/inversify';
import VoucherService from '../modules/voucher/voucher.service';
import VoucherController from '../modules/voucher/voucher.controller';

const container = new Container();

container.bind<VoucherController>(TYPES.VoucherController).to(VoucherController);
container.bind<VoucherService>(TYPES.VoucherService).to(VoucherService);

export default container;
