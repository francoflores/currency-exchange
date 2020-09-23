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
      name: "Libra",
      symbol: "£",
      code: "GBP",
      slug: 'gb'
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