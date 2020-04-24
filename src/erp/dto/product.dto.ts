import {
  IsString,
  Length,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { Product } from '../interfaces';

export class CreateProductDto implements Product {
  @IsString()
  @Length(24)
  readonly category: string;
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  readonly title: string;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly price_retail?: number;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly price_wholesale?: number;
}

export class UpdateProductDto implements Product {
  @IsString()
  @Length(24)
  readonly category: string;
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  readonly title: string;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly price_retail?: number;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly price_wholesale?: number;
}
