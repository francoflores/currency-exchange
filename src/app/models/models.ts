export class Conversion {
  constructor(
    public quantity: number, 
    public code_from: string,
    public code_to: string,
    public result: number) {}
}

export interface Currency {
  name: string,
  code: string,
  symbol: string,
  slug: string
}