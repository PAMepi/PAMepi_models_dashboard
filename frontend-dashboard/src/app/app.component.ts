import { ChartService } from './services/chart.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay } from 'rxjs/operators';
import { SIR } from './models/SIR';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  // chartjs
  @ViewChild('chart', { static: true })
  elemento!: ElementRef;

  @ViewChild('chartRt', { static: true })
  elementoRt!: ElementRef;

  @ViewChild('chartTx', { static: true })
  elementoTx!: ElementRef;

  data: SIR = {
    total_population: 5000,
    initial_infected: 1,
    transmission_rate: 0.5,
    recovery_rate: 0.2,
  };

  chart: any;
  chartRt: any;
  chartTx: any;

  constructor(
    private observer: BreakpointObserver,
    private chartService: ChartService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.chart = this.chartService.makeChart(this.elemento.nativeElement);
    this.chartRt = this.chartService.makeChart(
      this.elementoRt.nativeElement,
      this.chartService.datasetRt
    );
    this.chartTx = this.chartService.makeChart(
      this.elementoTx.nativeElement,
      this.chartService.datasetTx,
      'bar'
    );

    this.updateChartSIR();
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

  updateChartSIR() {
    this.chartService.removeData(this.chart);
    this.chartService.removeData(this.chartRt);
    this.chartService.removeData(this.chartTx);
    this.chartService
      .updateChartSIR(
        this.data.total_population,
        this.data.transmission_rate,
        this.data.recovery_rate,
        this.data.initial_infected
      )
      .subscribe((res: any) => {
        console.log(res);
        this.chartService.addData(this.chart, res.data);
        this.chartService.addData(this.chartRt, res.rt);
        this.chartService.addData(this.chartTx, res.casos);
      });
  }
}
