import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

import { ERPService } from './erp.service';
import { TransactionService } from './transaction.service';

import {
  CategoryRef,
  CategorySchema,
  ProductRef,
  ProductSchema,
  StockRef,
  StockSchema,
  TransactionRef,
  TransactionSchema,
  WaybillRef,
  WaybillSchema,
} from './schemas';
import { WaybillAction, PriceType, WaybillType } from './interfaces';

let mongod: MongoMemoryServer;

describe('Transaction service', () => {
  let module: TestingModule;
  let erpService: ERPService;
  let transactionService: TransactionService;

  afterEach(async () => {
    await module.close();
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    mongod = new MongoMemoryServer();
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: await mongod.getUri(),
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
          }),
        }),
        MongooseModule.forFeature([
          { name: CategoryRef, schema: CategorySchema },
          { name: ProductRef, schema: ProductSchema },
          { name: StockRef, schema: StockSchema },
          { name: TransactionRef, schema: TransactionSchema },
          { name: WaybillRef, schema: WaybillSchema },
        ]),
      ],
      providers: [ERPService, TransactionService],
    }).compile();
    erpService = module.get(ERPService);
    transactionService = module.get(TransactionService);
  });

  it('Transaction service should be defined', () => {
    expect(transactionService).toBeDefined();
  });

  it('should create transaction properly', async () => {
    const stock = await erpService.createStock({
      title: 'Склад',
      waybillPrefix: 'С',
    });
    const category = await erpService.createCategory({
      title: 'Памятник',
      unit: 'ед.',
    });
    const product = await erpService.createProduct({
      category: category._id,
      title: 'Памятник-1',
      price_retail: 400,
      price_wholesale: 370,
    });
    const transaction = await transactionService.WriteTransaction({
      stock: stock._id,
      quantity: 7,
      product: product._id,
      actionType: WaybillAction.BUY,
      waybillType: WaybillType.INCOME,
      priceType: PriceType.RETAIL,
      priceValue: 50,
    });
    expect(transaction.priceType).toBe('RETAIL');
    expect(transaction.waybillType).toBe('INCOME');
    expect(transaction.actionType).toBe('BUY');
    expect(transaction.priceValue).toBe(50);
    expect(transaction.quantity).toBe(7);
    expect(transaction.stock).toBe(stock._id);
    expect(transaction.product).toBe(product._id);
  });
});
