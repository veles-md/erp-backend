import { Controller, Get } from '@nestjs/common';
import { ERPService } from './erp.service';
import { CategoryModel } from './interfaces';

@Controller('/erp')
export class ERPController {
  constructor(private readonly erpService: ERPService) {}

  @Get('/categories')
  async getCategories(): Promise<CategoryModel[]> {
    return await this.erpService.getCategories();
  }
}
