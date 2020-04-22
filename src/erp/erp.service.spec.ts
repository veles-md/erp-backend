import { Test } from '@nestjs/testing';
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
} from './schemas';
import { CategoryModel, ProductModel, StockModel } from './interfaces';

const mongod = new MongoMemoryServer();

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('ERP module', () => {
  let erpService: ERPService;
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
        ]),
      ],
      providers: [ERPService],
    }).compile();
    erpService = module.get(ERPService);
  });

  it('ERP service should be defined', () => {
    expect(erpService).toBeDefined();
  });

  it('should create stock', async () => {
    stock = await erpService.createStock({
      title: 'TEST',
      waybillPrefix: 'TEST-Prefix',
    });
    let result = await erpService.getStocks();
    expect(result[0].title).toBe(stock.title);
    expect(result[0].waybillPrefix).toBe(stock.waybillPrefix);
  });

  // it('should increment income waybill number', async () => {
  //   let result = await stockService.nextIncomeWaybill(testable._id);
  //   expect(result).toBe(
  //     `${testable.waybillPrefix}-${testable.incomeWaybillCount + 1}`,
  //   );
  // });

  //   it('should increment outcome waybill number', async () => {
  //     let result = await stockService.nextOutcomeWaybill(testable._id);
  //     expect(result).toBe(
  //       `${testable.waybillPrefix}-${testable.outcomeWaybillCount + 1}`,
  //     );
  //   });

  it('should update stock', async () => {
    stock = await erpService.updateStock(stock._id, {
      title: 'Test-Updated',
      waybillPrefix: 'Prefix-Updated',
    });
    let result = await erpService.getStocks();
    expect(result[0].title).toBe('Test-Updated');
    expect(result[0].waybillPrefix).toBe('Prefix-Updated');
  });

  it('should remove stock', async () => {
    await erpService.removeStock(stock._id);
    let result = await erpService.getStocks();
    expect(result.length).toBe(0);
  });
});
