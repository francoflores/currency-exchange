import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { environment } from 'src/environments/environment';
import { Currency } from "../models/models";

@Injectable({providedIn: 'root'})
export class CurrencyService {

  rates: any;
  ratesUpdated = new Subject<any>();
  currenciesChanged = new Subject<{base:string, symbols:string}>();
  quantityChanged = new Subject<number>();

  url: string = environment.currency_api;

  currencyBaseChanged = new Subject<Currency>();

  currencies: Currency[] = [
    {
      name: "United States Dollar",
      symbol: "$",
      code: 'USD',
      slug: "us"
    },
    {
      name: "Canadian Dollar",
      symbol: "$",
      code: "CAD",
      slug: 'ca'
    },
    {
      name: "Euro",
      symbol: "€",
      code: "EUR",
      slug: 'eu'
    },
    {
      name: "British Pound",
      symbol: "£",
      code: "GBP",
      slug: 'gb'
    },
    {
      name: "Japanese Yen",
      symbol: "¥",
      code: "JPY",
      slug: 'jp'
    },
    {
      name: "Russian Ruble",
      symbol: "руб",
      code: "RUB",
      slug: 'ru'
    },
    {
      name: "Hong Kong Dollar",
      symbol: "$",
      code: "HKD",
      slug: 'hk'
    },
    {
      name: "Chinese Yuan",
      symbol: "¥",
      code: "CNY",
      slug: 'cn'
    },
    {
      name: "Mexican Peso",
      symbol: "$",
      code: "MXN",
      slug: 'mx'
    },
    {
      name: "Icelandic Króna",
      symbol: "kr",
      code: "ISK",
      slug: 'is'
    },
    {
      name: "Philippine Peso",
      symbol: "₱",
      code: "PHP",
      slug: 'ph'
    },
    {
      name: "Danish Krone",
      symbol: "kr",
      code: "DKK",
      slug: 'dk'
    },
    {
      name: "Hungarian Forint",
      symbol: "Ft",
      code: "HUF",
      slug: 'hu'
    },
    {
      name: "Czech Koruna",
      symbol: "Kč",
      code: "CZK",
      slug: 'cz'
    }
  ]

  currenciesToConvert: Array<string> = [];

  constructor(
    private httpClient: HttpClient
  ) {}

  setRates(rates: any): void {
    this.rates = rates;
    this.ratesUpdated.next(this.rates);
  }

  getCurrencies(): Array<Currency> {
    return this.currencies.slice();
  }

  getRates(base:string = 'EUR', to:string) {
    return this.httpClient.get(`${this.url}latest?base=${base}&symbols=${to}`);
  }

  getHistoryRates(base:string = "EUR", symbols: string, start:string, end:string) {
    return this.httpClient.get(`${this.url}history?start_at=${start}&end_at=${end}&base=${base}&symbols=${symbols}`);
  }

  getCurrenciesToConvert(): Array<string> {
    return this.currenciesToConvert.slice();
  }

}