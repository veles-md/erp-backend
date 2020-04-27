import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

import { ERPService } from './erp.service';
import {
  CategoryRef,
  CategorySchema,
  ProductRef,
  ProductSchema,
  StockRef,
  StockSchema,
  WaybillRef,
  WaybillSchema,
} from './schemas';

let mongod: MongoMemoryServer;

describe('ERP Service', () => {
  let module: TestingModule;
  let erpService: ERPService;

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
          { name: StockRef, schema: StockSchema },
          { name: ProductRef, schema: ProductSchema },
          { name: WaybillRef, schema: WaybillSchema },
        ]),
      ],
      providers: [ERPService],
    }).compile();
    erpService = module.get(ERPService);
  });

  it('ERP service should be defined', () => {
    expect(erpService).toBeDefined();
  });

  it('should create category', async () => {
    await erpService.createCategory({
      title: 'Венки',
      unit: 'м',
    });
    const result = await erpService.getCategories();
    expect(result[0].title).toBe('Венки');
    expect(result[0].unit).toBe('м');
  });

  it('should create stock', async () => {
    await erpService.createStock({
      title: 'TEST',
      waybillPrefix: 'TEST-Prefix',
    });
    let result = await erpService.getStocks();
    expect(result[0].title).toBe('TEST');
    expect(result[0].outcomeWaybillCount).toBe(0);
    expect(result[0].incomeWaybillCount).toBe(0);
    expect(result[0].waybillPrefix).toBe('TEST-Prefix');
  });

  it('should increment income waybill number', async () => {
    const stock = await erpService.createStock({
      title: 'TEST',
      waybillPrefix: 'TEST-Prefix',
    });
    const result = await erpService.stockNextIncomeWaybill(stock._id);
    expect(result).toBe(1);
  });

  it('should increment outcome waybill number', async () => {
    const stock = await erpService.createStock({
      title: 'TEST',
      waybillPrefix: 'TEST-Prefix',
    });
    let result = await erpService.stockNextOutcomeWaybill(stock._id);
    expect(result).toBe(1);
  });

  it('should update stock', async () => {
    const stock = await erpService.createStock({
      title: 'TEST',
      waybillPrefix: 'TEST-Prefix',
    });
    await erpService.updateStock(stock._id, {
      title: 'Test-Updated',
      waybillPrefix: 'Prefix-Updated',
    });
    let result = await erpService.getStocks();
    expect(result[0].title).toBe('Test-Updated');
    expect(result[0].waybillPrefix).toBe('Prefix-Updated');
  });

  it('should remove stock', async () => {
    const stock = await erpService.createStock({
      title: 'TEST',
      waybillPrefix: 'TEST-Prefix',
    });
    await erpService.removeStock(stock._id);
    let result = await erpService.getStocks();
    expect(result.length).toBe(0);
  });
});
