import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CurrencyService } from '../services/currency.service';
import { Currency } from '../models/models';

@Component({
  selector: 'app-convert-form',
  templateUrl: './convert-form.component.html',
  styleUrls: ['./convert-form.component.scss']
})
export class ConvertFormComponent implements OnInit, OnDestroy, AfterViewInit {

  currencyForm: FormGroup;
  convert: Number;
  loading: boolean = false;
  rates: any;

  idInterval: any;

  currencies: Array<Currency>;

  constructor(private currencyService: CurrencyService) { 
    this.currencies = this.currencyService.getCurrencies();

    this.currencyForm = new FormGroup({
      quantity: new FormControl('1', Validators.required),
      currencyFrom: new FormControl('USD', Validators.required),
      currencyTo: new FormControl('EUR', Validators.required)
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.currenciesChanged();
  }

  ngOnDestroy(): void {
    if(this.idInterval) {
      clearInterval(this.idInterval);
    }
  }

  onKeyUp() {
    this.currencyService.quantityChanged.next(Number(this.currencyForm.value.quantity));
  }

  onChange() {
    const currencyFrom: Currency = this.currencies.find(currency => currency.code === this.currencyForm.value.currencyFrom);
    if(currencyFrom) {
      this.currencyService.currencyBaseChanged.next(currencyFrom);
    }
  }

  onExchange() {
    let from = this.currencyForm.value.currencyFrom;
    let to = this.currencyForm.value.currencyTo;
    this.currencyForm.patchValue({
      currencyFrom: to,
      currencyTo: from
    });
    this.convertCurrency();
    this.currenciesChanged();
  }

  onConversionsChanged(codes: string[]):void {
    this.loadRates(this.currencyForm.value.currencyFrom, codes.toString());
  }

  private currenciesChanged() {
    this.currencyService.currenciesChanged.next({base: this.currencyForm.value.currencyFrom, symbols: this.currencyForm.value.currencyTo});
  }
  
  private convertCurrency () : void {

    let quantity = Number(this.currencyForm.value.quantity);
    let from = this.currencyForm.value.currencyFrom;
    let to = this.currencyForm.value.currencyTo;
    let rates = this.rates;

    let result = 0;
    if(from === to) {
      result = quantity;
    } else {
      result = quantity * rates[to];
    }
    this.convert = result;
  }

  private loadRates(from: string, codes: string) {
    this.loading = true;
    this.currencyService.getRates(from, codes)
      .subscribe(
        (response:any) => {
          this.rates = response; 
          this.loading = false;
          this.currencyService.setRates(this.rates);
        },
        error => {
          console.log(error);
          this.loading = false;
        }
      );
  }

  getFlagSlug(code: string): string {
    if(code == '') return '';
    const currency = this.currencies.find(currency => currency.code === code);
    return currency.slug;
  }

}
