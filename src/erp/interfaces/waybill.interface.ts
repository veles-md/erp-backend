import { Document } from 'mongoose';

import { Transaction } from './transaction.interface';
import { WaybillType, WaybillAction } from './enums';

export interface Waybill {
  readonly stock: string;
  readonly number: number;
  readonly type: WaybillType;
  readonly action: WaybillAction;
  readonly transactions: Transaction[];
}
export interface WaybillModel extends Waybill, Document {}
