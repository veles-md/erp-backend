import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectID } from 'bson';
import { Model } from 'mongoose';

import { TransactionRef } from './schemas';
import { TransactionModel, Transaction } from './interfaces';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TransactionRef)
    private readonly transactionModel: Model<TransactionModel>,
  ) {}

  async makeTransaction(transaction: Transaction): Promise<TransactionModel> {
    return await new this.transactionModel(transaction).save();
  }

  async calculateResidue(stock: string): Promise<any> {
    const aggregated = await this.transactionModel.aggregate([
      {
        $match: {
          stock: new ObjectID(stock),
        },
      },
      {
        $group: {
          _id: '$product',
          endBalance: {
            $sum: '$change',
          },
          income: {
            $sum: {
              $cond: [
                {
                  $and: [
                    // { $gte: ['$createdAt', startDate] },
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
                    // { $gte: ['$createdAt', startDate] },
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
    ]);
    return aggregated;
  }
}
