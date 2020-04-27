import { Document } from 'mongoose';

import { WaybillAction, WaybillType, PriceType } from './enums';

export interface Transaction {
  readonly product: string;
  readonly stock: string;
  readonly quantity: number;
  readonly priceValue: number;
  readonly priceType: PriceType;
  readonly waybillType: WaybillType;
  readonly actionType: WaybillAction;
}
export interface TransactionModel extends Transaction, Document {}
export interface ResidueOpts {
  readonly stock: string;
  readonly startDate: Date;
  readonly endDate: Date;
}
