import { IsString, MinLength, MaxLength } from 'class-validator';
import { Stock } from '../interfaces';

export class CreateStockDto implements Stock {
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  readonly title: string;
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  readonly waybillPrefix: string;
}
export class UpdateStockDto implements Stock {
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  readonly title: string;
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  readonly waybillPrefix: string;
}
