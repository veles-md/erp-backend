import { Document } from 'mongoose';

import { WaybillItem } from './waybill-item.interface';

export interface Transaction extends WaybillItem {
  readonly stock: string;
  readonly waybill: string;
  readonly date: Date;
  readonly updatedAt?: Date;
  readonly createdAt?: Date;
}
export interface TransactionModel extends Transaction, Document {}
export interface ResidueOpts {
  readonly stock: string;
  readonly startDate: Date;
  readonly endDate: Date;
}
