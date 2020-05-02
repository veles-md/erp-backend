import { Document } from 'mongoose';

export interface Product {
  readonly code: string;
  readonly title: string;
  readonly category: string;
  readonly price: number;
  readonly discount?: number;
}

export interface ProductModel extends Product, Document {}
