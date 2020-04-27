import { Document } from 'mongoose';

import { Transaction } from './transaction.interface';

export interface Waybill {
  readonly stock: string;
  readonly number: number;
  readonly type: string;
  readonly action: string;
  readonly transactions: Transaction[];
}
export interface WaybillModel extends Waybill, Document {}
