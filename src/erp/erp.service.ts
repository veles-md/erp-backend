import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoryRef, ProductRef } from './schemas';
import { CategoryModel, ProductModel } from './interfaces';

@Injectable()
export class ERPService {
  constructor(
    @InjectModel(CategoryRef)
    private readonly categoryModel: Model<CategoryModel>,
    @InjectModel(ProductRef) private readonly productModel: Model<ProductModel>,
  ) {}

  // Categories
  async getCategories(): Promise<CategoryModel[]> {
    return await this.categoryModel.find({}).exec();
  }
  async createCategory(category: any): Promise<CategoryModel> {
    return await new this.categoryModel(category).save();
  }
  async updateCategory(id, category): Promise<CategoryModel> {
    return await this.categoryModel.findByIdAndUpdate(id, category).exec();
  }
  async removeCategory(id) {
    return await this.categoryModel.findByIdAndDelete(id).exec();
  }

  // Products
  async getProducts(): Promise<ProductModel[]> {
    return await this.productModel.find({}).exec();
  }
  async createProduct(product: any): Promise<ProductModel> {
    return await new this.productModel(product).save();
  }
  async updateProduct(id, product): Promise<ProductModel> {
    return await this.productModel.findByIdAndUpdate(id, product).exec();
  }
  async removeProduct(id) {
    return await this.productModel.findByIdAndRemove(id).exec();
  }
}
