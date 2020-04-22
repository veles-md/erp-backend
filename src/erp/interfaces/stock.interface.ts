import { Document } from 'mongoose';

export interface Stock {
  readonly title: string;
  readonly waybillPrefix: string;
  readonly outcomeWaybillCount?: number;
  readonly incomeWaybillCount?: number;
}
export interface StockModel extends Stock, Document {}
