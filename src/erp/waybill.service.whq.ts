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
import { WaybillAction, PriceType } from './interfaces';
import { WaybillService } from './waybill.service';
import moment = require('moment');

let mongod: MongoMemoryServer;

describe('Waybill service', () => {
  let module: TestingModule;
  let erpService: ERPService;
  let transactionService: TransactionService;
  let waybillService: WaybillService;

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
      providers: [ERPService, TransactionService, WaybillService],
    }).compile();
    erpService = module.get(ERPService);
    transactionService = module.get(TransactionService);
    waybillService = module.get(WaybillService);
  });

  it('Waybill service should be defined', () => {
    expect(transactionService).toBeDefined();
  });

  it('should create one waybill properly', async () => {
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

    const waybill = await waybillService.createWaybill({
      action: WaybillAction.BUY,
      destination: stock._id,
      products: [
        {
          priceType: PriceType.RETAIL,
          priceValue: 50,
          product: product._id,
          quantity: 4,
        },
        {
          priceType: PriceType.RETAIL,
          priceValue: 50,
          product: product._id,
          quantity: 2,
        },
      ],
    });
    expect(waybill.length).toBe(1);
    expect(waybill[0].type).toBe('INCOME');
    expect(waybill[0].action).toBe('BUY');
    expect(waybill[0].transactions.length).toBe(2);
    expect(waybill[0].stock).toBe(stock._id);
    expect(waybill[0].number).toBe(1);
    expect(waybill[0].date).toBeDefined();
  });

  it('should create two waybills for MOVE action', async () => {
    const stockA = await erpService.createStock({
      title: 'Магазин',
      waybillPrefix: 'С',
    });
    const stockB = await erpService.createStock({
      title: 'Морг',
      waybillPrefix: 'C',
    });
    const category = await erpService.createCategory({
      title: 'Гроб',
      unit: 'ед.',
    });
    const product = await erpService.createProduct({
      category: category._id,
      title: 'Гроб-1',
      price_retail: 400,
      price_wholesale: 370,
    });

    const waybill = await waybillService.createWaybill({
      action: WaybillAction.MOVE,
      source: stockA._id,
      destination: stockB._id,
      products: [
        {
          priceType: PriceType.RETAIL,
          priceValue: 50,
          product: product._id,
          quantity: 4,
        },
      ],
    });
    expect(waybill.length).toBe(2);

    expect(waybill[1].type).toBe('OUTCOME');
    expect(waybill[1].action).toBe('MOVE');
    expect(waybill[1].stock).toBe(stockA._id);
    expect(waybill[1].transactions.length).toBe(1);
    expect(waybill[1].number).toBe(1);
    expect(waybill[1].date).toBeDefined();

    expect(waybill[0].type).toBe('INCOME');
    expect(waybill[0].action).toBe('MOVE');
    expect(waybill[0].stock).toBe(stockB._id);
    expect(waybill[0].transactions.length).toBe(1);
    expect(waybill[0].number).toBe(1);
    expect(waybill[0].date).toBeDefined();
  });

  it('should calculate residue properly', async () => {
    const stockA = await erpService.createStock({
      title: 'Склад',
      waybillPrefix: 'С',
    });
    const stockB = await erpService.createStock({
      title: 'Магазин',
      waybillPrefix: 'М',
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

    await waybillService.createWaybill({
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
    await waybillService.createWaybill({
      action: WaybillAction.IMPORT,
      destination: stockB._id,
      products: [
        {
          product: product._id,
          priceValue: 30,
          priceType: PriceType.RETAIL,
          quantity: 10,
        },
      ],
    });
    await waybillService.createWaybill({
      action: WaybillAction.MOVE,
      destination: stockB._id,
      source: stockA._id,
      products: [
        {
          product: product._id,
          priceValue: 30,
          priceType: PriceType.RETAIL,
          quantity: 1,
        },
      ],
    });
    await waybillService.createWaybill({
      action: WaybillAction.SELL,
      source: stockB._id,
      products: [
        {
          product: product._id,
          priceValue: 30,
          priceType: PriceType.RETAIL,
          quantity: 2,
        },
      ],
    });
    await waybillService.createWaybill({
      action: WaybillAction.UTILIZATION,
      source: stockB._id,
      products: [
        {
          product: product._id,
          priceValue: 30,
          priceType: PriceType.RETAIL,
          quantity: 1,
        },
      ],
    });
    await waybillService.createWaybill({
      action: WaybillAction.MOVE,
      destination: stockA._id,
      source: stockB._id,
      products: [
        {
          product: product._id,
          priceValue: 30,
          priceType: PriceType.RETAIL,
          quantity: 1,
        },
      ],
    });
    const resultA = await transactionService.calculateResidue({
      stock: stockA._id,
      startDate: moment.utc().startOf('day').toDate(),
      endDate: moment.utc().endOf('day').toDate(),
    });
    const resultB = await transactionService.calculateResidue({
      stock: stockB._id,
      startDate: moment.utc().startOf('day').toDate(),
      endDate: moment.utc().endOf('day').toDate(),
    });
    expect(resultA[0].income).toBe(4);
    expect(resultA[0].outcome).toBe(-1);
    expect(resultA[0].endBalance).toBe(3);

    expect(resultB[0].income).toBe(11);
    expect(resultB[0].outcome).toBe(-4);
    expect(resultB[0].endBalance).toBe(7);
  });
});
