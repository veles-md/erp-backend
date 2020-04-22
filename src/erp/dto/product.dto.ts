import { IsString, Length, MinLength, MaxLength } from 'class-validator';
import { Product } from '../interfaces';

export class CreateProductDto implements Product {
  @IsString()
  @Length(24)
  readonly category: string;
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  readonly title: string;
}

export class UpdateProductDto implements Product {
  @IsString()
  @Length(24)
  readonly category: string;
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  readonly title: string;
}
