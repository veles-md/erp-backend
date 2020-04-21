import { Document } from 'mongoose';

export interface Category {
  readonly title: string;
  readonly unit: string;
}

export interface CategoryModel extends Category, Document {}
