import { Document } from 'mongoose';
import { Price } from './waybill-item.interface';

export interface Transaction {
  readonly product: string;
  readonly price: Price;
  readonly stock: string;
  readonly change: number;
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
