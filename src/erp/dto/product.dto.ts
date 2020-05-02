import {
  IsString,
  Length,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
  Min,
  Max,
  IsOptional,
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
  @Transform((v: string) => v.replace(/^w/, (c) => c.toUpperCase()))
  @Transform((v: string) => v.trim())
  readonly code: string;
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Transform((v: string) => v.replace(/^w/, (c) => c.toUpperCase()))
  @Transform((v: string) => v.trim())
  readonly title: string;
  @IsNumber()
  @Transform((n) => Number(n))
  readonly price: number;
  @IsNumber()
  @Min(0)
  @Max(100)
  @Transform((n) => Number(n))
  @IsOptional()
  readonly discount?: number;
}

export class UpdateProductDto implements Product {
  @IsString()
  @Length(24)
  readonly category: string;
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @Transform((v: string) => v.replace(/^w/, (c) => c.toUpperCase()))
  @Transform((v: string) => v.trim())
  readonly code: string;
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Transform((v: string) => v.replace(/^w/, (c) => c.toUpperCase()))
  @Transform((v: string) => v.trim())
  readonly title: string;
  @IsNumber()
  @IsPositive()
  @Transform((n) => Number(n))
  readonly price: number;
  @IsNumber()
  @Min(0)
  @Max(100)
  @Transform((n) => Number(n))
  @IsOptional()
  readonly discount?: number;
}
