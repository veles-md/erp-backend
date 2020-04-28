import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { TransactionRef } from './schemas';
import {
  TransactionModel,
  Transaction,
  ResidueOpts,
  WaybillAction,
  WaybillType,
} from './interfaces';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TransactionRef)
    private readonly transactionModel: Model<TransactionModel>,
  ) {}

  async WriteBulkTransactions(
    waybillType: WaybillType,
    actionType: WaybillAction,
    stock: string,
    items: any[],
  ): Promise<TransactionModel[]> {
    return await Promise.all([
      ...items.map((item) =>
        this.WriteTransaction({
          waybillType: waybillType,
          actionType: actionType,
          stock: stock,
          product: item.product,
          quantity:
            waybillType === WaybillType.INCOME
              ? item.quantity
              : -1 * item.quantity,
          priceType: item.priceType,
          priceValue: item.priceValue,
        }),
      ),
    ]);
  }

  async WriteTransaction(transaction: Transaction): Promise<TransactionModel> {
    return await new this.transactionModel(transaction).save();
  }

  async calculateResidue(residueOpts: ResidueOpts): Promise<any> {
    const { stock, startDate, endDate } = residueOpts;

    let matchingOpts: Array<any> = [];
    if (stock !== undefined) {
      matchingOpts.push({
        $match: {
          stock: Types.ObjectId(stock),
        },
      });
    }

    const aggregated = await this.transactionModel
      .aggregate([
        ...matchingOpts,
        {
          $match: {
            createdAt: {
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: '$product',
            endBalance: {
              $sum: '$quantity',
            },
            startBalance: {
              $sum: {
                $cond: [{ $lte: ['$createdAt', startDate] }, '$quantity', 0],
              },
            },
            income: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$createdAt', startDate] },
                      { $gt: ['$quantity', 0] },
                    ],
                  },
                  '$quantity',
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
                      { $lt: ['$quantity', 0] },
                    ],
                  },
                  '$quantity',
                  0,
                ],
              },
            },
          },
        },
        {
          $lookup: {
            from: 'productrefs',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $unwind: '$product',
        },
        {
          $lookup: {
            from: 'categoryrefs',
            localField: 'product.category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category',
        },
      ])
      .exec();
    return aggregated;
  }
}
