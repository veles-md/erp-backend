import { Document } from 'mongoose';

export interface Product {
  readonly title: string;
  readonly category: string;
}

export interface ProductModel extends Product, Document {}
