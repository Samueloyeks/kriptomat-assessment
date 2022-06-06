export type Currency = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
};

export type CurrencyData = Pick<
  Currency,
  | "id"
  | "symbol"
  | "name"
  | "image"
  | "current_price"
  | "price_change_percentage_24h"
  | "high_24h"
  | "low_24h"
> & { favorite: boolean };
