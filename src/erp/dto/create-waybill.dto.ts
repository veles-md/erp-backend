import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

import { WaybillAction, WaybillItem } from '../interfaces';

export class CreateWaybillDto {
  @IsString()
  readonly action: WaybillAction;
  @IsString()
  readonly source?: string;
  @IsString()
  readonly destination?: string;
  @IsArray()
  @ArrayNotEmpty()
  readonly products: WaybillItem[];
}
