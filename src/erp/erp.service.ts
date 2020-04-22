import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoryRef, ProductRef, StockRef } from './schemas';
import { CategoryModel, ProductModel, StockModel } from './interfaces';
import { UpdateCategoryDto, CreateCategoryDto } from './dto';

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
  async createCategory(category: CreateCategoryDto): Promise<CategoryModel> {
    return await new this.categoryModel(category).save();
  }
  async updateCategory(
    id,
    category: UpdateCategoryDto,
  ): Promise<CategoryModel> {
    return await this.categoryModel.findByIdAndUpdate(id, category).exec();
  }
  async removeCategory(id: string) {
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
  async getStock(id: string): Promise<StockModel> {
    return await this.stockModel.findById(id).exec();
  }
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
  async stockNextIncomeWaybill(id: string): Promise<string> {
    let result = await this.stockModel
      .findByIdAndUpdate(id, {
        $inc: { incomeWaybillCount: 1 },
      })
      .exec();
    return `${result.waybillPrefix}-${
      result.toObject().incomeWaybillCount + 1
    }`;
  }
  async stockNextOutcomeWaybill(id: string): Promise<string> {
    let result = await this.stockModel
      .findByIdAndUpdate(id, {
        $inc: { outcomeWaybillCount: 1 },
      })
      .exec();
    return `${result.waybillPrefix}-${
      result.toObject().outcomeWaybillCount + 1
    }`;
  }
}
