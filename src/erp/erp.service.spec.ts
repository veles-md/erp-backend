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
  it('should update category', async () => {
    const category = await erpService.createCategory({
      title: 'Венки',
      unit: 'м',
    });
    const result = await erpService.updateCategory(category._id, {
      title: 'Венок',
      unit: 'ед',
    });
    expect(result._id).toStrictEqual(category._id);
    expect(category.title).toBe('Венки');
    expect(category.unit).toBe('м');
    expect(result.title).toBe('Венок');
    expect(result.unit).toBe('ед');
  });
  it('should remove category', async () => {
    const category = await erpService.createCategory({
      title: 'Венки',
      unit: 'м',
    });
    let result = await erpService.getCategories();
    expect(result.length).toBe(1);
    await erpService.removeCategory(category._id);
    result = await erpService.getCategories();
    expect(result.length).toBe(0);
  });
  it('should create with default discount product', async () => {
    const category = await erpService.createCategory({
      title: 'Венки',
      unit: 'ед',
    });
    const product = await erpService.createProduct({
      category: category._id,
      price: 100,
      title: 'Венок-1',
    });
    expect(product.title).toBe('Венок-1');
    expect(product.price).toBe(100);
    expect(product.discount).toBe(0);
    expect(product.category).toBeDefined();
  });
  it('should create with discount product', async () => {
    const category = await erpService.createCategory({
      title: 'Венки',
      unit: 'ед',
    });
    const product = await erpService.createProduct({
      category: category._id,
      price: 100,
      discount: 5,
      title: 'Венок-1',
    });
    expect(product.title).toBe('Венок-1');
    expect(product.price).toBe(100);
    expect(product.discount).toBe(5);
    expect(product.category).toBeDefined();
  });
  it('should update product', async () => {
    const category = await erpService.createCategory({
      title: 'Венки',
      unit: 'ед',
    });
    const product = await erpService.createProduct({
      category: category._id,
      price: 30,
      title: 'Венок-1',
    });
    await erpService.updateProduct(product._id, {
      category: category._id,
      title: 'Венок-2',
      price: 20,
      discount: 1,
    });
    const result = await erpService.getProducts();
    expect(result[0].title).toBe('Венок-2');
    expect(result[0].price).toBe(20);
    expect(result[0].discount).toBe(1);
  });
  it('should get products', async () => {
    const categoryA = await erpService.createCategory({
      title: 'Венки',
      unit: 'ед',
    });
    const categoryB = await erpService.createCategory({
      title: 'Гробы',
      unit: 'ед',
    });
    await erpService.createProduct({
      category: categoryA._id,
      price: 30,
      title: 'Венок-1',
    });
    await erpService.createProduct({
      category: categoryB._id,
      price: 30,
      title: 'Гроб-1',
    });
    const resultA = await erpService.getProducts();
    expect(resultA.length).toBe(2);
    const resultB = await erpService.getProducts(categoryB._id);
    expect(resultB.length).toBe(1);
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
    expect(result).toBe('TEST-Prefix-1');
  });
  it('should increment outcome waybill number', async () => {
    const stock = await erpService.createStock({
      title: 'TEST',
      waybillPrefix: 'TEST-Prefix',
    });
    let result = await erpService.stockNextOutcomeWaybill(stock._id);
    expect(result).toBe('TEST-Prefix-1');
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
