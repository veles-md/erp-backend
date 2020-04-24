import { Schema } from 'mongoose';

import { ProductRef } from './product.schema';
import { StockRef } from './stock.schema';

export const TransactionRef = 'TransactionRef';
export const TransactionSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: ProductRef,
    required: true,
  },
  stock: {
    type: Schema.Types.ObjectId,
    ref: StockRef,
    required: true,
  },
  change: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => value !== 0,
    },
  },
  price: {
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  date: {
    type: Date,
    required: true,
  },
  waybill: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
