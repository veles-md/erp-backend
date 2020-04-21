import { Controller, Get, Body, Post } from '@nestjs/common';
import { ERPService } from './erp.service';
import { CategoryModel } from './interfaces';

@Controller('/erp')
export class ERPController {
  constructor(private readonly erpService: ERPService) {}

  @Get('/categories')
  async getCategories(): Promise<CategoryModel[]> {
    return await this.erpService.getCategories();
  }

  @Post('/categories')
  async createCategory(@Body() cateory): Promise<CategoryModel> {
    return await this.erpService.createCategory(cateory);
  }
}
