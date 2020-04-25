import { Schema } from 'mongoose';

import { CategoryRef } from './category.schema';

export const ProductRef = 'ProductRef';
export const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: CategoryRef,
      required: true,
    },
    price_retail: {
      type: Number,
      required: true,
    },
    price_wholesale: {
      type: Number,
      requiredPaths: true,
    },
  },
  {
    timestamps: true,
  },
);
