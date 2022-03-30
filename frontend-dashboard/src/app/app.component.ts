import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables, ChartType } from 'chart.js';

import { HttpClient } from '@angular/common/http';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('chart1', { static: true })
  elemento!: ElementRef;

  dadosDigitados: Dados = {
    inicialInfectados: 1,
    taxaRecuperacao: 0.2,
    totalPopulacao: 5000,
    taxaContato: 0.5,
  };

  chart: any;

  constructor(private http: HttpClient) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.gerarGrafico();
    this.atribuirValores();
  }

  gerarGrafico() {
    this.chart = new Chart(this.elemento.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Suscetíveis',
            data: [],
            fill: false,
            borderColor: 'rgb(41, 66, 166)',
            backgroundColor: 'rgb(41, 66, 166)',
            tension: 0.1,
          },
          {
            label: 'Infectados',
            data: [],
            fill: false,
            borderColor: 'rgb(235, 122, 52)',
            backgroundColor: 'rgb(235, 122, 52)',
            tension: 0.1,
          },
          {
            label: 'Recuperados',
            data: [],
            fill: false,
            borderColor: 'rgb(52, 235, 52)',
            backgroundColor: 'rgb(52, 235, 52)',
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

  atribuirValores() {
    this.removeData(this.chart);
    let url =
      `https://polar-cliffs-29261.herokuapp.com/api/sir?N=${this.dadosDigitados.totalPopulacao}` +
      `&beta=${this.dadosDigitados.taxaContato}` +
      `&gamma=${this.dadosDigitados.taxaRecuperacao}` +
      `&I0=${this.dadosDigitados.inicialInfectados}`;

    this.http.get(url).subscribe((res) => this.addData(this.chart, res));
  }

  addData(chart: any, data: any) {
    let arr3 = chart.data.datasets.map((item: any, i: any) =>
      Object.assign({}, item, data[i])
    );
    chart.data.datasets = arr3;
    chart.update();
  }

  removeData(chart: any) {
    chart.data.datasets.forEach((dataset: any) => {
      dataset.data = [];
    });
    chart.update();
  }
}

interface Dataset {
  label: string;
  data: object[];
}

interface Dados {
  totalPopulacao: number;
  inicialInfectados: number;
  taxaContato: number;
  taxaRecuperacao: number;
}
