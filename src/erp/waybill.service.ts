import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as moment from 'moment';

import { WaybillModel, Waybill } from './interfaces';
import { WaybillRef } from './schemas';

@Injectable()
export class WaybillService {
  constructor(
    @InjectModel(WaybillRef)
    private readonly waybillModel: Model<WaybillModel>,
  ) {}

  async getWaybills(): Promise<WaybillModel[]> {
    return await this.waybillModel.find({}).exec();
  }

  async createWaybill(waybill: Waybill): Promise<WaybillModel> {
    return await new this.waybillModel(waybill).save();
  }
}
