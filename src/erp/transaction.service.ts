import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectID } from 'bson';
import { Model } from 'mongoose';
import * as moment from 'moment';

import { ERPService } from './erp.service';
import { TransactionRef } from './schemas';
import { TransactionModel, Transaction } from './interfaces';
import { ResidueOpts } from './interfaces/transaction.interface';
import { CreateWaybillDto, WaybillAction } from './dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TransactionRef)
    private readonly transactionModel: Model<TransactionModel>,
    private readonly erpService: ERPService,
  ) {}

  async makeWaybill(waybill: CreateWaybillDto): Promise<any> {
    const date = moment().toDate();
    switch (waybill.action) {
      case WaybillAction.SELL:
      case WaybillAction.UTILIZATION:
        {
          // Transaction session
          const waybillNumber = await this.erpService.stockNextOutcomeWaybill(
            waybill.source,
          );
          await Promise.all(
            waybill.products.map((item) => {
              this.makeTransaction({
                stock: waybill.source,
                product: item.product,
                price: item.price,
                change: -Math.abs(item.quantity),
                waybill: waybillNumber,
                date: date,
              });
            }),
          );
        }
        break;
      case WaybillAction.BUY:
      case WaybillAction.IMPORT:
        {
        }
        break;
      case WaybillAction.MOVE:
        {
        }
        break;
      case WaybillAction.PRODUCTION:
        {
        }
        break;
      default:
        // throw Exception
        break;
    }
  }

  async makeTransaction(transaction: Transaction): Promise<TransactionModel> {
    return await new this.transactionModel(transaction).save();
  }

  async calculateResidue(residueOpts: ResidueOpts): Promise<any> {
    const { stock, startDate, endDate } = residueOpts;
    const aggregated = await this.transactionModel
      .aggregate([
        {
          $match: {
            stock: new ObjectID(stock),
            createdAt: {
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: '$product',
            endBalance: {
              $sum: '$change',
            },
            startBalance: {
              $sum: {
                $cond: [{ $lte: ['$createdAt', startDate] }, '$change', 0],
              },
            },
            income: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$createdAt', startDate] },
                      { $gt: ['$change', 0] },
                    ],
                  },
                  '$change',
                  0,
                ],
              },
            },
            outcome: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$createdAt', startDate] },
                      { $lt: ['$change', 0] },
                    ],
                  },
                  '$change',
                  0,
                ],
              },
            },
          },
        },
      ])
      .exec();
    return aggregated;
  }
}
