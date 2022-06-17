import { highchartsOptions } from '../../helpers/translate';
import { ChartService } from './../../services/chart.service';
import { chartCasesOptions } from './../../helpers/chart-cases';
import { chartRtOptions } from './../../helpers/chart-rt';
import { chartModelOptions } from '../../helpers/chart-model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay } from 'rxjs/operators';
import { SIR } from '../../models/SIR';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_Data from 'highcharts/modules/export-data';
HC_exporting(Highcharts);
HC_Data(Highcharts);

@Component({
  selector: 'app-chart-models',
  templateUrl: './chart-models.component.html',
  styleUrls: ['./chart-models.component.css'],
})
export class ChartModelsComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  Highcharts: typeof Highcharts = Highcharts;
  flagUpdate: boolean = false;
  chartTitle: string = 'SIR';
  selectModel: string = 'sir';
  oneToOneFlag: boolean = false;
  chartRt: Highcharts.Options = chartRtOptions;
  chartCases: Highcharts.Options = chartCasesOptions;
  chartModel: Highcharts.Options = chartModelOptions;
  translatePt = highchartsOptions;
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) {
    setTimeout(() => {
      chart.reflow();
    }, 300);
  };

  data: SIR = {
    total_population: 5000,
    initial_infected: 1,
    transmission_rate: 1,
    recovery_rate: 0.4,
    incubation_rate: 2,
    gammaa: 0.2,
    rho: 0.3,
  };

  constructor(
    private observer: BreakpointObserver,
    private chartService: ChartService
  ) {}

  ngOnInit(): void {
    this.chartUpdate();
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
      .updateChartSIR(
        this.data.total_population,
        this.data.transmission_rate,
        this.data.recovery_rate,
        this.data.initial_infected,
        1 / this.data.incubation_rate
      )
      .subscribe((res: any) => {
        this.chartModel.series = [
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'Suscetíveis',
            data: res.data.filter((d: any) => d.label == 'Suscetíveis')[0].data,
            lineWidth: 4,
            color: '#429867',
          },
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'Infectados',
            data: res.data.filter((d: any) => d.label == 'Infectados')[0].data,
            lineWidth: 4,
            color: '#c41026',
          },
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'Recuperados',
            data: res.data.filter((d: any) => d.label == 'Recuperados')[0].data,
            lineWidth: 4,
            color: '#2b5166',
          },
        ];
        this.chartRt.series = [
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'RT',
            data: res.rt[0].data,
            lineWidth: 4,
            color: '#0a516d',
          },
        ];
        this.chartCases.series = [
          {
            type: 'column',
            name: 'Casos Acumulados',
            data: res.casos[0].data,
            color: '#696758',
            visible: false,
          },
          {
            type: 'column',
            name: 'Casos Diários',
            data: res.casos[1].data,
            color: '#0a516d',
          },
        ];
        this.oneToOneFlag = true;
        this.flagUpdate = true;
      });
  }

  chartUpdateSeir() {
    this.chartService
      .updateChartSEIR(
        this.data.total_population,
        this.data.transmission_rate,
        this.data.recovery_rate,
        this.data.initial_infected,
        this.data.incubation_rate
      )
      .subscribe((res: any) => {
        this.chartModel.series = [
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'Suscetíveis',
            data: res.data.filter((d: any) => d.label == 'Suscetíveis')[0].data,
            lineWidth: 4,
            color: '#429867',
          },
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'Infectados',
            data: res.data.filter((d: any) => d.label == 'Infectados')[0].data,
            lineWidth: 4,
            color: '#c41026',
          },
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'Recuperados',
            data: res.data.filter((d: any) => d.label == 'Recuperados')[0].data,
            lineWidth: 4,
            color: '#2b5166',
          },
          {
            marker: {
              enabled: false,
            },
            name: 'Expostos',
            data: res.data.filter((d: any) => d.label == 'Expostos')[0].data,
            type: 'line',
            lineWidth: 4,
            color: '#fab243',
          },
        ];
        this.chartRt.series = [
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'RT',
            data: res.rt[0].data,
            lineWidth: 4,
            color: '#0a516d',
          },
        ];
        this.chartCases.series = [
          {
            type: 'column',
            name: 'Casos Acumulados',
            data: res.casos[0].data,
            color: '#696758',
            visible: false,
          },
          {
            type: 'column',
            name: 'Casos Diários',
            data: res.casos[1].data,
            color: '#0a516d',
          },
        ];
        this.oneToOneFlag = true;
        this.flagUpdate = true;
      });
  }

  chartUpdateSeiir() {
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
      .subscribe((res: any) => {
        this.chartModel.series = [
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'Suscetíveis',
            data: res.data.filter((d: any) => d.label == 'Suscetíveis')[0].data,
            lineWidth: 4,
            color: '#429867',
          },
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'Infectados',
            data: res.data.filter((d: any) => d.label == 'Infectados')[0].data,
            lineWidth: 4,
            color: '#c41026',
          },
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'Recuperados',
            data: res.data.filter((d: any) => d.label == 'Recuperados')[0].data,
            lineWidth: 4,
            color: '#2b5166',
          },
          {
            marker: {
              enabled: false,
            },
            name: 'Expostos',
            data: res.data.filter((d: any) => d.label == 'Expostos')[0].data,
            type: 'line',
            lineWidth: 4,
            color: '#fab243',
          },
          {
            marker: {
              enabled: false,
            },
            name: 'Infectados Assintomáticos',
            data: res.data.filter(
              (d: any) => d.label == 'Infectados Assintomáticos'
            )[0].data,
            type: 'line',
            lineWidth: 4,
            color: '#F66B0E',
          },
        ];
        // Infectados Assintomáticos
        this.chartRt.series = [
          {
            marker: {
              enabled: false,
            },
            type: 'line',
            name: 'RT',
            data: res.rt[0].data,
            lineWidth: 4,
            color: '#0a516d',
          },
        ];
        this.chartCases.series = [
          {
            type: 'column',
            name: 'Casos Acumulados',
            data: res.casos[0].data,
            color: '#696758',
            visible: false,
          },
          {
            type: 'column',
            name: 'Casos Diários',
            data: res.casos[1].data,
            color: '#0a516d',
          },
        ];
        this.oneToOneFlag = true;
        this.flagUpdate = true;
      });
  }

  changeModel(event: any) {
    if (event.target.value == 'seir') {
      this.chartUpdateSeir();
      this.chartTitle = 'SEIR';
    } else if (event.target.value == 'seiir') {
      this.chartUpdateSeiir();
      this.chartTitle = 'SEIIR';
    } else {
      this.chartUpdate();
      this.chartTitle = 'SIR';
    }
  }
}
