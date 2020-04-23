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
    const category = await erpService.createCategory({
      title: 'Гроб',
      unit: 'ед',
    });
    const stock = await erpService.createStock({
      title: 'Магазин',
      waybillPrefix: 'М',
    });
    const product = await erpService.createProduct({
      title: 'Гроб-1',
      category: category._id,
    });
    const transaction = await transactionService.makeTransaction({
      stock: stock._id,
      change: 5,
      product: product._id,
    });
    expect(transaction).toMatchObject({
      stock: stock._id,
      change: 5,
      product: product._id,
    });
    expect(transaction.createdAt).toBeDefined();
    expect(transaction.updatedAt).toBeDefined();
  });

  it('should calculate residues transaction', async () => {
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
    const date_1 = moment().subtract(10, 'days').toDate();
    const date_2 = moment().subtract(8, 'days').toDate();
    const date_3 = moment().subtract(6, 'days').toDate();
    const date_4 = moment().subtract(4, 'days').toDate();
    await transactionService.makeTransaction({
      stock: stock._id,
      change: 7,
      product: product._id,
      createdAt: date_1,
      updatedAt: date_1,
    });
    await transactionService.makeTransaction({
      stock: stock._id,
      change: 2,
      product: product._id,
      createdAt: date_2,
      updatedAt: date_2,
    });
    await transactionService.makeTransaction({
      stock: stock._id,
      change: 3,
      product: product._id,
      createdAt: date_3,
      updatedAt: date_3,
    });
    await transactionService.makeTransaction({
      stock: stock._id,
      change: -4,
      product: product._id,
      createdAt: date_4,
      updatedAt: date_4,
    });
    const result = await transactionService.calculateResidue(stock._id);
    expect(result.length).toBe(1);
    expect(result[0].endBalance).toBe(8);
    expect(result[0].income).toBe(12);
    expect(result[0].outcome).toBe(-4);
  });
});
