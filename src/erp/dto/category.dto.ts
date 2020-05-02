import { MinLength, MaxLength, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { Category } from 'src/erp/interfaces';

export class CreateCategoryDto implements Category {
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  @Transform((v: string) => v.trim().replace(/^./, (c) => c.toUpperCase()))
  readonly title: string;
  @IsString()
  @MinLength(1)
  @MaxLength(5)
  readonly unit: string;
}
export class UpdateCategoryDto implements Category {
  @IsString()
  @MinLength(4)
  @MaxLength(15)
  @Transform((v: string) => v.trim().replace(/^./, (c) => c.toUpperCase()))
  readonly title: string;
  @IsString()
  @MinLength(1)
  @MaxLength(5)
  readonly unit: string;
}
