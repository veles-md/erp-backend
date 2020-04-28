import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as moment from 'moment';

import { TransactionService } from './transaction.service';
import { ERPService } from './erp.service';

import {
  WaybillModel,
  Waybill,
  WaybillAction,
  WaybillType,
} from './interfaces';
import { WaybillRef } from './schemas';
import { CreateWaybillDto } from './dto';

@Injectable()
export class WaybillService {
  constructor(
    @InjectModel(WaybillRef)
    private readonly waybillModel: Model<WaybillModel>,
    private readonly transactionService: TransactionService,
    private readonly erpService: ERPService,
  ) {}

  async getWaybills(): Promise<WaybillModel[]> {
    return await this.waybillModel
      .find({})
      .populate({
        path: 'transactions',
        populate: {
          path: 'product',
          select: ['title', 'category'],
          populate: {
            path: 'category',
            select: ['title', 'unit'],
          },
        },
      })
      .populate('stock')
      .exec();
  }

  async createWaybill(waybill: CreateWaybillDto): Promise<WaybillModel[]> {
    const date = moment.utc().toDate();
    switch (waybill.action) {
      case WaybillAction.BUY:
      case WaybillAction.IMPORT: {
        const waybillNumber = await this.erpService.stockNextIncomeWaybill(
          waybill.destination,
        );
        const transactions = await this.transactionService.WriteBulkTransactions(
          WaybillType.INCOME,
          waybill.action,
          waybill.destination,
          waybill.products,
        );
        return [
          await new this.waybillModel({
            type: WaybillType.INCOME,
            stock: waybill.destination,
            number: waybillNumber,
            action: waybill.action,
            date: date,
            transactions: transactions.map((t) => t._id),
          }).save(),
        ];
      }
      case WaybillAction.SELL:
      case WaybillAction.UTILIZATION: {
        const waybillNumber = await this.erpService.stockNextOutcomeWaybill(
          waybill.source,
        );
        const transactions = await this.transactionService.WriteBulkTransactions(
          WaybillType.OUTCOME,
          waybill.action,
          waybill.source,
          waybill.products,
        );
        return [
          await new this.waybillModel({
            type: WaybillType.OUTCOME,
            stock: waybill.source,
            number: waybillNumber,
            action: waybill.action,
            date: date,
            transactions: transactions.map((t) => t._id),
          }).save(),
        ];
      }
      case WaybillAction.MOVE: {
        const outcomeWaybillNumber = await this.erpService.stockNextOutcomeWaybill(
          waybill.source,
        );
        const incomeWaybillNumber = await this.erpService.stockNextIncomeWaybill(
          waybill.source,
        );
        const outcomeTransactions = await this.transactionService.WriteBulkTransactions(
          WaybillType.OUTCOME,
          waybill.action,
          waybill.source,
          waybill.products,
        );
        const incomeTransactions = await this.transactionService.WriteBulkTransactions(
          WaybillType.INCOME,
          waybill.action,
          waybill.destination,
          waybill.products,
        );
        return [
          await new this.waybillModel({
            type: WaybillType.INCOME,
            stock: waybill.destination,
            number: incomeWaybillNumber,
            action: waybill.action,
            date: date,
            transactions: incomeTransactions.map((t) => t._id),
          }).save(),
          await new this.waybillModel({
            type: WaybillType.OUTCOME,
            stock: waybill.source,
            number: outcomeWaybillNumber,
            action: waybill.action,
            date: date,
            transactions: outcomeTransactions.map((t) => t._id),
          }).save(),
        ];
      }
      case WaybillAction.PRODUCTION:
        break;
      default:
        throw new Error('Error creating waybill E[WaybillService]');
    }
  }
}
