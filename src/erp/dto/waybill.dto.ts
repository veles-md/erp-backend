import {
  IsString,
  Length,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

import { WaybillAction, PriceType } from '../interfaces';

interface Product {
  readonly product: string;
  readonly quantity: number;
  readonly priceType: PriceType;
  readonly priceValue: number;
}
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
  readonly products: Product[];
}
