import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoryRef, ProductRef, StockRef } from './schemas';
import { CategoryModel, ProductModel, StockModel } from './interfaces';

@Injectable()
export class ERPService {
  constructor(
    @InjectModel(CategoryRef)
    private readonly categoryModel: Model<CategoryModel>,
    @InjectModel(ProductRef) private readonly productModel: Model<ProductModel>,
    @InjectModel(StockRef) private readonly stockModel: Model<StockModel>,
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
    return await this.productModel.find({}).populate('category').exec();
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

  // Stocks
  async getStocks(): Promise<StockModel[]> {
    return await this.stockModel.find({}).exec();
  }
  async createStock(stock): Promise<StockModel> {
    return await new this.stockModel(stock).save();
  }
  async updateStock(id, stock): Promise<StockModel> {
    return await this.stockModel.findByIdAndUpdate(id, stock).exec();
  }
  async removeStock(id) {
    return await this.stockModel.findByIdAndRemove(id).exec();
  }
}
