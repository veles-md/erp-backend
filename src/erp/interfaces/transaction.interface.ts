import { Document } from 'mongoose';

export interface Transaction {
  product: string;
  stock: string;
  change: number;
}
export interface TransactionModel extends Transaction, Document {}
