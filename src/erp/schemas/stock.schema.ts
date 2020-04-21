import { Schema } from 'mongoose';

export const StockRef = 'StockRef';
export const StockSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    waybillPrefix: {
      type: String,
      unique: true,
      required: true,
    },
    incomeWaybillCount: {
      type: Number,
      default: 0,
    },
    outcomeWaybillCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
