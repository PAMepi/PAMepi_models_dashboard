import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-chart-rt',
  templateUrl: './chart-rt.component.html',
  styleUrls: ['./chart-rt.component.css'],
})
export class ChartRtComponent implements OnInit {
  @ViewChild('chart', { static: true })
  element!: ElementRef;
  chart: any;
  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.makeChart();
  }
  makeChart() {
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
