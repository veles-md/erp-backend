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
  WaybillRef,
  WaybillSchema,
} from './schemas';
import { WaybillAction, PriceType, WaybillType } from './interfaces';
import { WaybillService } from './waybill.service';

const mongod = new MongoMemoryServer();

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Transaction service', () => {
  let erpService: ERPService;
  let transactionService: TransactionService;
  let waybillService: WaybillService;
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
          { name: WaybillRef, schema: WaybillSchema },
        ]),
      ],
      providers: [ERPService, TransactionService, WaybillService],
    }).compile();
    erpService = module.get(ERPService);
    transactionService = module.get(TransactionService);
    waybillService = module.get(WaybillService);
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
    console.log(transaction);
    expect(transaction.priceType).toBe('RETAIL');
    expect(transaction.waybillType).toBe('INCOME');
    expect(transaction.actionType).toBe('BUY');
    expect(transaction.priceValue).toBe(50);
    expect(transaction.quantity).toBe(7);
    expect(transaction.stock).toBe(stock._id);
    expect(transaction.product).toBe(product._id);
  });

  it('should calculate residue properly', async () => {
    const stockA = await erpService.createStock({
      title: 'Магазин',
      waybillPrefix: 'М',
    });
    const stockB = await erpService.createStock({
      title: 'Морг',
      waybillPrefix: 'МГ',
    });
    const category = await erpService.createCategory({
      title: 'Венок',
      unit: 'ед',
    });
    const product = await erpService.createProduct({
      category: category._id,
      title: 'Венок-1',
      price_wholesale: 50,
      price_retail: 70,
    });

    const waybill = await waybillService.createWaybill({
      action: WaybillAction.BUY,
      destination: stockA._id,
      products: [
        {
          product: product._id,
          priceValue: 30,
          priceType: PriceType.RETAIL,
          quantity: 3,
        },
      ],
    });
    console.log(waybill);
  });
});
