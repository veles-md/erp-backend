import {
  Controller,
  Get,
  Body,
  Post,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ERPService } from './erp.service';
import { CategoryModel, ProductModel, StockModel } from './interfaces';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('/erp')
export class ERPController {
  constructor(private readonly erpService: ERPService) {}

  // Cateories
  @Get('/categories')
  async getCategories(): Promise<CategoryModel[]> {
    return await this.erpService.getCategories();
  }
  @Post('/categories')
  async createCategory(
    @Body() cateory: CreateCategoryDto,
  ): Promise<CategoryModel> {
    return await this.erpService.createCategory(cateory);
  }
  @Put('/categories/:id')
  async updateCategory(@Param('id') id: string, @Body() category) {
    return await this.erpService.updateCategory(id, category);
  }
  @Delete('/categories/:id')
  async removeCategory(@Param('id') id) {
    return await this.erpService.removeCategory(id);
  }

  // Products
  @Get('/products')
  async getProducts(): Promise<ProductModel[]> {
    return await this.erpService.getProducts();
  }
  @Post('/products')
  async createProduct(@Body() product: any): Promise<ProductModel> {
    return await this.erpService.createProduct(product);
  }
  @Put('/products/:id')
  async updateProduct(@Param('id') id: string, @Body() product) {
    return await this.erpService.updateProduct(id, product);
  }
  @Delete('/products/:id')
  async removeProduct(@Param('id') id) {
    return await this.erpService.removeProduct(id);
  }

  // Stocks
  @Get('/stocks')
  async getStocks(): Promise<StockModel[]> {
    return await this.erpService.getStocks();
  }
  @Post('/stocks')
  async createStock(@Body() stock): Promise<StockModel> {
    return await this.erpService.createStock(stock);
  }
  @Put('/stock/:id')
  async updateStock(@Param('id') id, @Body() stock): Promise<StockModel> {
    return await this.erpService.updateStock(id, stock);
  }
  @Delete('/stock/:id')
  async removeStock(@Param('id') id) {
    return await this.erpService.removeStock(id);
  }
}
