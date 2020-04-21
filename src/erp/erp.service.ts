import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CategoryRef } from './schemas';
import { CategoryModel } from './interfaces';

@Injectable()
export class ERPService {
  constructor(
    @InjectModel(CategoryRef)
    private readonly categoryModel: Model<CategoryModel>,
  ) {}

  // Categories
  async getCategories(): Promise<CategoryModel[]> {
    return await this.categoryModel.find({}).exec();
  }
  async createCategory(cateory: any): Promise<CategoryModel> {
    return await new this.categoryModel(cateory).save();
  }
}
