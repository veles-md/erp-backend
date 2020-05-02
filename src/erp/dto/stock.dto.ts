import { IsString, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

import { Stock } from '../interfaces';

export class CreateStockDto implements Stock {
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  @Transform((v: string) => v.trim().replace(/^./, (c) => c.toUpperCase()))
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
  @Transform((v: string) => v.trim().replace(/^./, (c) => c.toUpperCase()))
  readonly title: string;
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  readonly waybillPrefix: string;
}
