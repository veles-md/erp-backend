import { Schema } from 'mongoose';
import * as moment from 'moment';

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
  quantity: {
    type: Number,
    required: true,
    validate: {
      validator: (value: number) => value !== 0,
    },
  },
  waybill: {
    type: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  snapshot: {
    price: {
      type: Number,
      required: true,
    },
    reduce: {
      type: Boolean,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: () => moment.utc().valueOf(),
  },
});
