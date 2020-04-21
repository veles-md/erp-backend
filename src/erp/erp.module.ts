import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoryRef, CategorySchema, StockRef, StockSchema } from './schemas';
import { ProductRef, ProductSchema } from './schemas/product.schema';
import { ERPService } from './erp.service';
import { ERPController } from './erp.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategoryRef, schema: CategorySchema },
      { name: StockRef, schema: StockSchema },
      { name: ProductRef, schema: ProductSchema },
    ]),
  ],
  controllers: [ERPController],
  providers: [ERPService],
})
export class ERPModule {}
