import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import * as moment from 'moment';

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
    });
    const waybill = await erpService.stockNextOutcomeWaybill(stock._id);
    const date = moment().toDate();

    const transaction = await transactionService.makeTransaction({
      stock: stock._id,
      change: 7,
      product: product._id,
      price: {
        type: 'retail',
        value: 50,
      },
      date: date,
      waybill: waybill,
      createdAt: date,
      updatedAt: date,
    });
    expect(transaction.date).toBe(date);
    expect(transaction.createdAt).toBe(date);
    expect(transaction.updatedAt).toBe(date);
    expect(transaction.waybill).toBe('С-1');
    expect(transaction.price).toEqual({
      type: 'retail',
      value: 50,
    });
    expect(transaction.change).toBe(7);
    expect(transaction.stock).toBe(stock._id);
    expect(transaction.product).toBe(product._id);
  });
});
