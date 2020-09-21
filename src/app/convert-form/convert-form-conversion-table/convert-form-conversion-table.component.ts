import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { Conversion, Currency } from '../../models/models';
import { CurrencyService } from '../../services/currency.service';

import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-convert-form-conversion-table',
  templateUrl: './convert-form-conversion-table.component.html',
  styleUrls: ['./convert-form-conversion-table.component.scss']
})
export class ConvertFormConversionTableComponent implements OnInit, AfterViewInit {

  @Output() conversionsChanged = new EventEmitter<string[]>();
  @ViewChild(MatTable, {static: false}) table: MatTable<Conversion>;

  dataSource: MatTableDataSource<Conversion>;
  conversions: Array<Conversion> = [];
  displayedColumns: string[] = ['quantity', 'code_from', 'code_to', 'result'];
  currencies: Array<Currency>;
  rates: any;

  constructor(
    private currencyService: CurrencyService
  ) {
    this.currencies = this.currencyService.getCurrencies();
    this.dataSource = new MatTableDataSource(this.conversions);
   }

  ngOnInit(): void {
    this.currencyService.currencyBaseChanged
      .subscribe(
        (currency: Currency) => {
          this.updateCurrencyBase(currency);
          this.conversionsChanged.emit(this.conversions.map(conversion => conversion.code_to));
        });
    
    this.currencyService.ratesUpdated
      .subscribe(
        ratesObject => {
          this.rates = ratesObject.rates;
          this.convert();
        });
    
    this.currencyService.quantityChanged
      .subscribe(
        (quantity:number) => {
          this.updateQuantity(quantity);
          this.convert()
        }
      );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {this.onAddConversion();}, 3000);
  }

  onAddConversion() {
    
    const lastConversion = this.conversions[this.conversions.length - 1];
    if(lastConversion) {
      this.conversions.push(new Conversion(
        lastConversion.quantity,
        lastConversion.code_from,
        lastConversion.code_to,
        lastConversion.result
      ));

    } else {
      this.conversions.push(new Conversion(1, "USD", "EUR", 0));
    }

    this.conversionsChanged.emit(this.conversions.map(conversion => conversion.code_to));

    this.dataSource.data = this.conversions;
    
  }

  onChange(): void {
    this.conversionsChanged.emit(this.conversions.map(conversion => conversion.code_to));
  }

  private convert() {
    this.conversions.forEach(conversion => {
      conversion.result = conversion.quantity * (conversion.code_from === conversion.code_to? 1:this.rates[conversion.code_to]);
    });
  }

  private updateCurrencyBase(currency: Currency) {
    this.dataSource.data = this.conversions.map(
      conversion => {
        conversion.code_from = currency.code;
        return conversion;
      });
  }

  private updateQuantity(quantity: number) {
    this.dataSource.data = this.conversions.map(
      conversion => {
        conversion.quantity = quantity;
        return conversion;
      });
  }

  getFlagSlug(code: string): string {
    if(code == '') return '';
    const currency = this.currencies.find(currency => currency.code === code);
    return currency.slug;
  }

}
