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
import { WaybillAction, PriceType, WaybillType } from './interfaces';

const mongod = new MongoMemoryServer();

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Transaction service', () => {
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
      price_retail: 400,
      price_wholesale: 370,
    });
    const transaction = await transactionService.makeTransaction({
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

    await transactionService.makeWaybill({
      action: WaybillAction.BUY,
      products: [
        {
          product: product._id,
          quantity: 5,
          priceType: PriceType.RETAIL,
          priceValue: 40,
        },
      ],
      destination: stockA._id,
    });
    await transactionService.makeWaybill({
      action: WaybillAction.IMPORT,
      products: [
        {
          product: product._id,
          quantity: 7,
          priceType: PriceType.RETAIL,
          priceValue: 30,
        },
      ],
      destination: stockA._id,
    });
    await transactionService.makeWaybill({
      action: WaybillAction.SELL,
      products: [
        {
          product: product._id,
          quantity: 2,
          priceType: PriceType.RETAIL,
          priceValue: 30,
        },
      ],
      source: stockA._id,
    });
    await transactionService.makeWaybill({
      action: WaybillAction.UTILIZATION,
      products: [
        {
          product: product._id,
          quantity: 1,
          priceType: PriceType.RETAIL,
          priceValue: 30,
        },
      ],
      source: stockA._id,
    });
    await transactionService.makeWaybill({
      action: WaybillAction.MOVE,
      products: [
        {
          product: product._id,
          quantity: 1,
          priceType: PriceType.RETAIL,
          priceValue: 30,
        },
      ],
      source: stockA._id,
      destination: stockB._id,
    });

    let result = await transactionService.calculateResidue({
      stock: stockA._id,
      startDate: moment.utc().startOf('day').valueOf(),
      endDate: moment.utc().endOf('day').valueOf(),
    });
    expect(result.length).toBe(1);
    expect(result[0].startBalance).toBe(0);
    expect(result[0].income).toBe(12);
    expect(result[0].outcome).toBe(-4);
    expect(result[0].endBalance).toBe(8);
    result = await transactionService.calculateResidue({
      stock: stockB._id,
      startDate: moment.utc().startOf('day').valueOf(),
      endDate: moment.utc().endOf('day').valueOf(),
    });
    expect(result.length).toBe(1);
    expect(result[0].startBalance).toBe(0);
    expect(result[0].income).toBe(1);
    expect(result[0].outcome).toBe(0);
    expect(result[0].endBalance).toBe(1);
  });
});
