import { Document } from 'mongoose';

import { WaybillAction, WaybillType } from './enums';

export interface TransactionSnapshot {
  readonly price: number;
  readonly reduce: boolean;
  readonly discount: number;
}
export interface Transaction {
  readonly product: string;
  readonly stock: string;
  readonly quantity: number;

  readonly waybill: {
    readonly type: WaybillType;
    readonly action: WaybillAction;
    readonly id: string;
    readonly date: Date;
  };
  readonly snapshot: TransactionSnapshot;
}
export interface TransactionModel extends Transaction, Document {}
export interface ResidueOpts {
  readonly stock: string;
  readonly startDate: Date;
  readonly endDate: Date;
}
