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

@Component({
  selector: 'app-chart-models',
  templateUrl: './chart-models.component.html',
  styleUrls: ['./chart-models.component.css'],
})
export class ChartModelsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  flagUpdate: boolean = false;
  chartRt: Highcharts.Options = chartRtOptions;
  chartCases: Highcharts.Options = chartCasesOptions;
  chartModel: Highcharts.Options = chartModelOptions;
  chart!: Highcharts.Chart;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  selectModel: string = 'sir';
  oneToOneFlag: boolean = false;
  data: SIR = {
    total_population: 5000,
    initial_infected: 1,
    transmission_rate: 0.5,
    recovery_rate: 0.2,
    incubation_rate: 2,
  };

  constructor(
    private observer: BreakpointObserver,
    private chartService: ChartService
  ) {
    console.log(this.selectModel);
  }

  ngOnInit(): void {
    this.chartUpdate();
    this.addDataModels();
    this.addDataRt();
    this.addDataCases();
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

  addDataCases() {
    this.chartCases.series = [
      {
        name: 'Casos Acumulados',
        data: [],
        type: 'column',
        color: '#15133C',
      },
      {
        name: 'Casos Diários',
        data: [],
        type: 'column',
        color: '#73777B',
      },
    ];
  }

  addDataRt() {
    this.chartRt.series = [
      {
        marker: {
          enabled: false,
        },
        name: 'RT',
        data: [],
        type: 'line',
        lineWidth: 4,
        color: '#022C64',
      },
    ];
  }

  addDataModels() {
    this.chartModel.series = [
      {
        marker: {
          enabled: false,
        },
        name: 'Suscetíveis',
        data: [],
        type: 'line',
        lineWidth: 4,
        color: '#001D6E',
      },
      {
        marker: {
          enabled: false,
        },
        name: 'Infectados',
        data: [],
        type: 'line',
        lineWidth: 4,
        color: '#A80F0A',
      },
      {
        marker: {
          enabled: false,
        },
        name: 'Recuperados',
        data: [],
        type: 'line',
        lineWidth: 4,
        color: '#446A46',
      },
    ];
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
        console.log(res.data.filter( (d:any ) => d.label == 'Suscetíveis' ))
        this.chartModel.series = [
          {
            type: 'line',
            name: 'Suscetíveis',
            data: res.data.filter( (d:any ) => d.label == 'Suscetíveis')[0].data,
          },
          {
            type: 'line',
            name: 'Infectados',
            data:res.data.filter( (d:any ) => d.label == 'Infectados')[0].data,
          },
          {
            type: 'line',
            name: 'Recuperados',
            data: res.data.filter( (d:any ) => d.label == 'Recuperados')[0].data,
          },
          {
            marker: {
              enabled: false,
            },
            name: 'Expostos',
            data: res.data.filter( (d:any ) => d.label == 'Expostos')[0].data,
            type: 'line',
            lineWidth: 4,
            color: 'pink',
          },
        ];
        this.oneToOneFlag = true;
        this.flagUpdate = true;
      });
  }
  chartUpdate() {
    this.chartService
      .updateChartSIR(
        this.data.total_population,
        this.data.transmission_rate,
        this.data.recovery_rate,
        this.data.initial_infected
      )
      .subscribe((res: any) => {
        this.chartModel.series = [
          {
            type: 'line',
            name: 'Suscetíveis',
            data: res.data.filter( (d:any ) => d.label == 'Suscetíveis')[0].data,
          },
          {
            type: 'line',
            name: 'Infectados',
            data:res.data.filter( (d:any ) => d.label == 'Infectados')[0].data,
          },
          {
            type: 'line',
            name: 'Recuperados',
            data: res.data.filter( (d:any ) => d.label == 'Recuperados')[0].data,
          },
        ];
        this.chartRt.series = [
          {
            type: 'line',
            name: 'RT',
            data: res.rt[0].data,
          },
        ];
        this.chartCases.series = [
          {
            type: 'column',
            name: 'Casos Acumulados',
            data: res.casos[0].data,
          },
          {
            type: 'column',
            name: 'Casos Diários',
            data: res.casos[1].data,
          },
        ];
        this.oneToOneFlag =true
        this.flagUpdate = true;
      });
  }

  changeModel(event: any) {
    if(event.target.value == 'seir'){
      this.chartUpdateSeir()
    }else{
      this.chartUpdate()
    }
  }

  highchartsOptions = Highcharts.setOptions({
    lang: {
      loading: 'Aguarde...',
      months: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ],
      weekdays: [
        'Domingo',
        'Segunda',
        'Terça',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sábado',
      ],
      shortMonths: [
        'Jan',
        'Feb',
        'Mar',
        'Abr',
        'Maio',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ],
    },
  });
}
