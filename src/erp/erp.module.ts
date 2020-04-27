import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  CategoryRef,
  CategorySchema,
  StockRef,
  StockSchema,
  ProductRef,
  ProductSchema,
  TransactionRef,
  TransactionSchema,
  WaybillRef,
  WaybillSchema,
} from './schemas';

import { TransactionService } from './transaction.service';
import { ERPService } from './erp.service';
import { WaybillService } from './waybill.service';
import { ERPController } from './erp.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategoryRef, schema: CategorySchema },
      { name: StockRef, schema: StockSchema },
      { name: ProductRef, schema: ProductSchema },
      { name: TransactionRef, schema: TransactionSchema },
      { name: WaybillRef, schema: WaybillSchema },
    ]),
  ],
  controllers: [ERPController],
  providers: [ERPService, TransactionService, WaybillService],
})
export class ERPModule {}
