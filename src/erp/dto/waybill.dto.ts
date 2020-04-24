import {
  IsString,
  IsDate,
  Length,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsObject,
} from 'class-validator';

import { Item } from '../interfaces/waybill-item.interface';

export enum WaybillAction {
  SELL = 'Продажа',
  UTILIZATION = 'Утилизация',
  BUY = 'Покупка',
  IMPORT = 'Импорт',
  MOVE = 'Перемещение',
  PRODUCTION = 'Производство',
}

export class CreateWaybillDto {
  @IsDate()
  readonly date: Date;

  @IsObject()
  readonly action: WaybillAction;

  @IsString()
  @Length(24)
  @IsOptional()
  readonly source?: string;
  @IsString()
  @Length(24)
  @IsOptional()
  readonly destination?: string;
  @IsArray()
  @ArrayNotEmpty()
  readonly products: Item[];
}
