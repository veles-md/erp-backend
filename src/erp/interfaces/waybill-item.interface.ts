export interface Price {
  readonly value: number;
  readonly type: 'retail' | 'wholesale';
}
export interface Item {
  readonly product: string;
  readonly quantity: number;
  readonly price: Price;
}
