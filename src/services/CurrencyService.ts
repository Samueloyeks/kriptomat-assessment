import http from "../http-common";
import { Currency } from "../types/Currency";

const getAll = () => {
  return http.get<Array<Currency>>(
    "/markets?vs_currency=eur&order=market_cap_desc&per_page=50&page=1"
  );
};

const get = (id: any, from: number, to: number) => {
  return http.get(
    `/${id}/market_chart/range?vs_currency=eur&from=${from}&to=${to}`
  );
};

const CurrencyService = {
  getAll,
  get,
};

export default CurrencyService;
