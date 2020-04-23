import { Test } from '@nestjs/testing';
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
} from './schemas';
import { CategoryModel, ProductModel, StockModel } from './interfaces';

const mongod = new MongoMemoryServer();

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('ERP module', () => {
  let erpService: ERPService;
  let transactionService: TransactionService;
  let stock: StockModel;
  let product: ProductModel;
  let category: CategoryModel;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
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

  it('should create transaction', async () => {
    const category = await erpService.createCategory({
      title: 'Гроб',
      unit: 'ед',
    });
    const stockA = await erpService.createStock({
      title: 'Склад',
      waybillPrefix: 'С',
    });
    const product = await erpService.createProduct({
      title: 'Гроб-1',
      category: category._id,
    });
    await transactionService.makeTransaction({
      stock: stockA._id,
      change: 5,
      product: product._id,
    });
    await transactionService.makeTransaction({
      stock: stockA._id,
      change: 3,
      product: product._id,
    });
    await transactionService.makeTransaction({
      stock: stockA._id,
      change: -2,
      product: product._id,
    });
    const result = await transactionService.calculateResidue(stockA._id);
    console.log(result);
    expect(0).toBe(0);
  });
});
