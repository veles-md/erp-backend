import { Schema } from 'mongoose';

import { StockRef } from './stock.schema';
import { TransactionRef } from './transaction.schema';

export const WaybillRef = 'WaybillRef';
export const WaybillSchema = new Schema(
  {
    stock: {
      type: Schema.Types.ObjectId,
      ref: StockRef,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    transactions: {
      type: [{ type: Schema.Types.ObjectId, ref: TransactionRef }],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
