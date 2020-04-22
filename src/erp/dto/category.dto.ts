import { Category } from 'src/erp/interfaces';

import { MinLength, MaxLength, IsString, Length } from 'class-validator';

export class CreateCategoryDto implements Category {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  readonly title: string;
  @IsString()
  @MinLength(2)
  @MaxLength(5)
  readonly unit: string;
}
export class UpdateCategoryDto implements Category {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  readonly title: string;
  @IsString()
  @MinLength(2)
  @MaxLength(5)
  readonly unit: string;
}
