import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import Highcharts from 'highcharts';
import { delay } from 'rxjs/operators';
import { chartModelOptions } from 'src/app/helpers/chart-model';
import { highchartsOptions } from 'src/app/helpers/translate';
import { SIR } from 'src/app/models/SIR';
import { ChartService } from 'src/app/services/chart.service';

@Component({
  selector: 'app-model-comparison',
  templateUrl: './model-comparison.component.html',
  styleUrls: ['./model-comparison.component.css']
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
    }, 300)
  }
  labelSelect:string = "Infectados"

  data: SIR = {
    total_population: 5000,
    initial_infected: 1,
    transmission_rate: 1,
    recovery_rate: 0.4,
    incubation_rate: 2,
    gammaa: 0.2,
    rho: 0.3,
  };

  constructor(    private observer: BreakpointObserver,
    private chartService: ChartService) { }

  ngOnInit(): void {
    this.chartUpdate()
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
      .subscribe((seiir: any) => {
        this.chartService.updateChartSEIR(this.data.total_population,
          this.data.transmission_rate,
          this.data.recovery_rate,
          this.data.initial_infected,
          this.data.incubation_rate).subscribe((seir:any) =>{
            this.chartService.updateChartSIR(this.data.total_population,
              this.data.transmission_rate,
              this.data.recovery_rate,
              this.data.initial_infected,this.data.incubation_rate).subscribe((sir:any) =>{
                console.log(sir.data.filter((d: any) => d.label == this.labelSelect))
                this.chartModel.series = [
                  {
                    marker: {
                      enabled: false,
                    },
                    type: 'line',
                    name: 'SEIIR',
                    data: seiir.data.filter((d: any) => d.label == this.labelSelect)[0].data,
                    lineWidth: 4,
                    color: 'red',
                  },
                  {
                    marker: {
                      enabled: false,
                    },
                    type: 'line',
                    name: 'SEIR',
                    data: seir.data.filter((d: any) => d.label == this.labelSelect)[0].data,
                    lineWidth: 4,
                    color: 'pink',
                  },
                  {
                    marker: {
                      enabled: false,
                    },
                    type: 'line',
                    name: 'SIR',
                    data: sir.data.filter((d: any) => d.label == this.labelSelect)[0].data,
                    lineWidth: 4,
                    color: 'blue',
                  },
                ];
                this.oneToOneFlag = true;
                this.flagUpdate = true;

              })
          })

      });
  }

  changeLabel(event: any){
    this.chartUpdate()
  }

}
