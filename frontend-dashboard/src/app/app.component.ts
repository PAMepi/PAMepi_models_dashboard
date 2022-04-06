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

  data: SIR = {
    total_population: 5000,
    initial_infected: 1,
    transmission_rate: 0.5,
    recovery_rate: 0.2,
  };

  chart: any;

  constructor(
    private observer: BreakpointObserver,
    private chartService: ChartService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.makeChart();
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

  makeChart() {
    this.chart = new Chart(this.elemento.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Suscetíveis',
            data: [],
            fill: false,
            borderColor: '#022C64',
            backgroundColor: '#022C64',
            tension: 0.1,
          },
          {
            label: 'Infectados',
            data: [],
            fill: false,
            borderColor: '#A80F0A',
            backgroundColor: '#A80F0A',
            tension: 0.1,
          },
          {
            label: 'Recuperados',
            data: [],
            fill: false,
            borderColor: '#146F2F',
            backgroundColor: '#146F2F',
            tension: 0.1,
          },
        ],
      },
      options: {
        layout: {
          padding: 20,
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  updateChartSIR() {
    this.chartService.removeData(this.chart);
    this.chartService
      .updateChartSIR(
        this.data.total_population,
        this.data.transmission_rate,
        this.data.recovery_rate,
        this.data.initial_infected
      )
      .subscribe((res) => {
        this.chartService.addData(this.chart, res);
      });
  }
}
