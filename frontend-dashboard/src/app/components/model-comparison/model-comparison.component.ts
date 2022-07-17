import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {MatSnackBar} from '@angular/material/snack-bar';

import Highcharts from 'highcharts';

import { of, switchMap } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { chartModelOptions } from 'src/app/helpers/chart-model';
import { highchartsOptions } from 'src/app/helpers/translate';
import { SIR } from 'src/app/models/SIR';
import { ChartService } from 'src/app/services/chart.service';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';

@Component({
  selector: 'app-model-comparison',
  templateUrl: './model-comparison.component.html',
  styleUrls: ['./model-comparison.component.css'],
})
export class ModelComparisonComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  Highcharts: typeof Highcharts = Highcharts;
  flagUpdate: boolean = false;
  oneToOneFlag: boolean = false;
  chartModel: Highcharts.Options = chartModelOptions;
  translatePt = highchartsOptions;
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) {
    setTimeout(() => {
      chart.reflow();
    }, 300);
  };
  labelSelect: string = 'Infectados';

  selectedColumn: string = '';
  columns: string[] = [];
  realData: any;

  data: SIR = {
    total_population: 5000,
    initial_infected: 1,
    transmission_rate: 1,
    recovery_rate: 0.4,
    incubation_rate: 2,
    gammaa: 0.2,
    rho: 0.3,
    mortality: 0,
  };

  displayStyle = 'none';
  uploadFile: boolean = false;
  fileName!:string

  constructor(
    private observer: BreakpointObserver,
    private chartService: ChartService,
    private ngxCsvParser: NgxCsvParser,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.chartUpdate();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'x', {
      duration: 5000,
      panelClass: ['snack-color'],
    });
  }

  openPopup() {
    this.displayStyle = 'block';
  }

  closePopup() {
    this.displayStyle = 'none';
  }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 1024px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
  }

  chartUpdate() {
    this.chartService
      .updateChartSEIIR(
        this.data.total_population,
        this.data.transmission_rate,
        this.data.recovery_rate,
        this.data.initial_infected,
        this.data.incubation_rate,
        this.data.gammaa,
        this.data.rho
      )
      .pipe(
        map((x) => {
          return { seiir: flattenObject(x), seir: [], sir: [] };
        }),
        switchMap((result) => {
          return this.chartService
            .updateChartSEIR(
              this.data.total_population,
              this.data.transmission_rate,
              this.data.recovery_rate,
              this.data.initial_infected,
              this.data.incubation_rate
            )
            .pipe(
              map((x) => {
                result['seir'] = flattenObject(x);
                return result;
              })
            );
        }),
        switchMap((result) => {
          return this.chartService
            .updateChartSIR(
              this.data.total_population,
              this.data.transmission_rate,
              this.data.recovery_rate,
              this.data.initial_infected
            )
            .pipe(
              map((x) => {
                result['sir'] = flattenObject(x);
                return result;
              })
            );
        })
      )
      .subscribe((data: any) => {
        this.chartModel.series = [
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'SEIIR',
            data: extractData(data['seiir'], this.labelSelect),
            lineWidth:5,
            color: '#124B40',
          },
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'SEIR',
            data: extractData(data['seir'], this.labelSelect),
            lineWidth:5,
            color: '#774360',
          },
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'SIR',
            data: extractData(data['sir'], this.labelSelect),
            lineWidth:5,
            color: '#001E6C',
          },
          {
            marker: {
              lineWidth: 2,
              lineColor: '#F66B0E',
              symbol: 'bubble'
            },
            type: 'line',
            name: 'Dados Reais',
            data: this.realSerie,
            lineWidth: 7,
            color: '#F66B0E',
            visible: this.uploadFile,
            opacity: 0.8
          },
        ];

        this.oneToOneFlag = true;
        this.flagUpdate = true;
      });
  }

  changeLabel(event: any) {
    this.chartUpdate();
    if (
      event.target.value == 'Casos Acumulados' ||
      event.target.value == 'Casos Diários'
    ) {
      this.uploadFile = true;
    } else {
      this.uploadFile = false;
    }
  }

  realSerie: number[] = [];
  header: boolean = true;

  @ViewChild('fileImportInput') fileImportInput: any;

  fileChangeListener($event: any): void {
    const files = $event.srcElement.files;
    this.fileName = $event.target.value

    this.header =
      (this.header as unknown as string) === 'true' || this.header === true;

    this.ngxCsvParser
      .parse(files[0], { header: this.header, delimiter: ',' })
      .pipe()
      .subscribe(
        (result: any) => {
          this.columns = Object.keys(result[0])
          this.selectedColumn = this.columns[0]
          this.realData = result
          this.updateRealData()
        },
        (error: NgxCSVParserError) => {
          console.log('Error', error);
        }
      );
  }
  updateRealData(){
    let message: string = "Use os gráficos 'Casos Diários' e 'Casos Acumulados' para uma melhor visualização dos dados reais.";

    this.realSerie = this.realData.map((d: any) => {
      return Number.parseFloat(d[this.selectedColumn]);
    });

    console.log(this.realSerie)

    if(this.realSerie.map(d => isNaN(d)).every(Boolean)){
      this.openSnackBar("Coluna não numérica");
      throw new NgxCSVParserError()
    } else {
      this.data.total_population = Math.round(Math.max(...this.realSerie) * 1.5 + 100);
      this.chartUpdate();
      this.openSnackBar(message);
    }
  }
}



function extractData(ob: any, selectedLabel: string) {
  let data = ob.filter((d: any) => d.label == selectedLabel);

  if (data.length) {
    data = data[0].data;
  }

  return data;
}

function flattenObject(ob: any) {
  var toReturn: any = [];

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == 'object' && ob[i] !== null) {
      var flatObject = ob[i];
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn.push(flatObject[x]);
      }
    } else {
      toReturn.push(ob[i]);
    }
  }
  return toReturn;
}
