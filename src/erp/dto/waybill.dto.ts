import {
  IsString,
  Length,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

import { WaybillAction } from '../interfaces';

export class CreateWaybillDto {
  @IsString()
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
  readonly products: Array<any>;
}
