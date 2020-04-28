import {
  IsString,
  Length,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Transform } from 'class-transformer';
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
  @Transform((n) => Number(n))
  readonly price_retail: number;
  @IsNumber()
  @IsPositive()
  @Transform((n) => Number(n))
  readonly price_wholesale: number;
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
  @Transform((n) => Number(n))
  readonly price_retail: number;
  @IsNumber()
  @IsPositive()
  @Transform((n) => Number(n))
  readonly price_wholesale: number;
}
