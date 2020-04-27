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
      validator: (value: number) => value > 0,
    },
  },
  priceType: {
    type: String,
    required: true,
  },
  priceValue: {
    type: String,
    required: true,
  },
  waybillType: {
    type: String,
    required: true,
  },
  actionType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => moment.utc().valueOf(),
  },
  updatedAt: {
    type: Date,
    default: () => moment.utc().valueOf(),
  },
});
