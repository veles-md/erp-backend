import {
  IsString,
  IsDate,
  Length,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
} from 'class-validator';

import { Item, WaybillAction } from '../interfaces';

export class CreateWaybillDto {
  @IsDate()
  readonly date: Date;

  @IsNumber()
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
