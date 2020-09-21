import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import HC_exporting from 'highcharts/modules/exporting';
import HC_offline_exporting from 'highcharts/modules/offline-exporting';
import { CurrencyService } from '../services/currency.service';
HC_exporting(Highcharts);
HC_offline_exporting(Highcharts);

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  updateFlag: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  
  chartOptions: Highcharts.Options;

  tooltipValue = {
    base: '',
    symbols: '',
    date: '',
    value: 0
  }

  constructor(private currencyService: CurrencyService) {
    const component = this;

    this.chartOptions = {
      chart: {
        animation: false,
        zoomType: "x"
      },
      title: {
        text: 'Value of'
      },
      tooltip: {
        useHTML: true,
        shared: true,
        formatter: function() {
          let html = `<strong>Date: ${this.x}</strong><br/>`;
          this.points.forEach((point:any) => {
            html += `1 ${point.point.custom.base} = <strong style="color:${point.color}">${point.y} ${point.point.custom.symbols}</strong><br/>`; 
          })
          return html;
        }
      },
      exporting: {
        fallbackToExportServer: false,
        enabled: false
      },
      xAxis: [{
        type: "category",
        crosshair: true,
        categories: []
      }],
      yAxis: [{
        title: {
          text: 'Quantity'
        }
      }],
      series: []
    };
   }

  ngOnInit(): void {
    this.currencyService.ratesUpdated
      .subscribe(
        (ratesObj: any) => {
          this.getHistoryRates(ratesObj.base, Object.keys(ratesObj.rates).toString(), moment().startOf('month').format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"))
        }
      );
  }

  private getHistoryRates(base: string, symbols: string, start:string, end:string) {
    this.currencyService.getHistoryRates(base, symbols, start, end)
      .subscribe(
        (response:any) => {
          this.setDataOnChart(response, symbols);
        }
      );
  }

  private setDataOnChart(ratesObj: any, symbols: string) {

    // Setting Y axis
    this.chartOptions.title.text = `Value of ${ratesObj.base}`;
    let currencies =  symbols.split(',');

    const series = Array<Highcharts.SeriesLineOptions>();
    currencies.forEach((currencyCode, index) => {
      series.push({
        id: currencyCode,
        index: index,
        type: 'line',
        name: currencyCode,
        data: Object.keys(ratesObj.rates).map(rate => {return {y: Number(ratesObj.rates[rate][currencyCode].toFixed(2)), custom: {base: ratesObj.base, symbols: currencyCode}}})
      });
    });

    this.chartOptions.series = series;

    this.chartOptions.xAxis[0].categories = Object.keys(ratesObj.rates).sort();

    Highcharts.charts[0].update(this.chartOptions, true, true, false);

    this.updateFlag = true;
  }

  onDownloadPDF() : void {
    this.exportCharts(this.Highcharts.charts, {type: 'application/pdf'});
  }

  private getSVG (charts, options, callback) {
    var svgArr = [],
      top = 0,
      width = 0,
      height = 0,
      addSVG = function(svgres) {
        // Grab width/height from exported chart
        var svgWidth = +svgres.match(
            /^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/
          )[1],
          svgHeight = +svgres.match(
            /^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/
          )[1],
          // Offset the position of this chart in the final SVG
          svg;

        console.log(`${width} / ${top} / ${svgWidth} / ${svgHeight}`);
        if(svgWidth > 500) {
          //console.log(width + '/' + top);
          svg = svgres.replace('<svg', '<g transform="translate(' + width + ', '+ top +' )"');
          width = 0;
          top += svgHeight; 
        } else if(width + svgWidth > 500) {
          width = 0;
          top += svgHeight; 
          svg = svgres.replace('<svg', '<g transform="translate(' + width + ', '+ top +' )"');
        } else {
          svg = svgres.replace('<svg', '<g transform="translate(' + width + ', '+ top +' )"');
          width += svgWidth;
        }
  
        svg = svg.replace('</svg>', '</g>');
        svgArr.push(svg);
      },
      exportChart = function(i) {
        if (i === charts.length) {
          width = 700;
          top += 400; 
          
          return callback('<svg height="' + top + '" width="' + width +
            '" version="1.1" xmlns="http://www.w3.org/2000/svg">' + svgArr.join('') + '</svg>');
        }
        charts[i].getSVGForLocalExport(options, {}, function(e) {
          console.log("Failed to get SVG");
        }, function(svg) {
          addSVG(svg);
          return exportChart(i + 1); // Export next only when this SVG is received
        });
      };
      
    exportChart(0);
  };

  private exportCharts (charts: any, options: any) {
    options = Highcharts.merge(Highcharts.getOptions().exporting, options);
    console.log(options);
  
    // Get SVG asynchronously and then download the resulting SVG
    this.getSVG(charts, options, function(svg) {
      Highcharts.downloadSVGLocal(svg, options, function() {
        console.log("Failed to export on client side");
      });
    });
  };

}
