import { Document } from 'mongoose';

export interface Product {
  readonly title: string;
  readonly category: string;
  readonly price_retail: number;
  readonly price_wholesale: number;
}

export interface ProductModel extends Product, Document {}
