import { Document } from 'mongoose';

export interface Transaction {
  product: string;
  stock: string;
  change: number;
  updatedAt?: Date;
  createdAt?: Date;
}
export interface TransactionModel extends Transaction, Document {}
