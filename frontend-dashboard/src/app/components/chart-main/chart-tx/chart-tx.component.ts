import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables, ChartType } from 'chart.js';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-chart-tx',
  templateUrl: './chart-tx.component.html',
  styleUrls: ['./chart-tx.component.css'],
})
export class ChartTxComponent implements OnInit {
  @ViewChild('chart', { static: true })
  element!: ElementRef;
  chart: any;
  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.gerarGrafico();
  }
  gerarGrafico() {
    this.chart = new Chart(this.element.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'rt',
            data: [],
            fill: false,
            borderColor: 'rgb(41, 66, 166)',
            backgroundColor: 'rgb(41, 66, 166)',
            tension: 0.1,
          },
        ],
      },
      options: {
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
}
