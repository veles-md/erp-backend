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
  },
  {
    timestamps: true,
  },
);
