
import * as moment from 'moment';
import "moment/locale/nl";
import { SIR } from '../models/SIR';
import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';
import "chartjs-adapter-moment";

moment.locale("pt-br");

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  SIR!: SIR;
  baseUrl: string = 'https://app-dashboard-covid.herokuapp.com/api';

  datasetModel = datasetModel
  datasetRt = datasetRt
  datasetTx = datasetTx

  constructor(private http: HttpClient) {}

  updateChartSIR(
    population: number,
    transmission: number,
    recovery: number,
    infected: number
  ) {
    let url =
      `${this.baseUrl}/sir?N=${population}` +
      `&beta=${transmission}` +
      `&gamma=${recovery}` +
      `&I0=${infected}`;
    return this.http.get(url);
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


  makeChart(element: HTMLCanvasElement, dataset: any = this.datasetModel, type:any = 'line') {
    let chart = new Chart(element, {
      type: type,
      data: {
        datasets: dataset,
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
            stepSize: 2
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
    });
    return chart;
  }

}


let datasetModel = [
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
]

let datasetRt = [
  {
    label: 'Rt',
    data: [],
    fill: false,
    borderColor: '#022C64',
    backgroundColor: '#022C64',
    tension: 0.1,
  }
]

let datasetTx = [
  {
    label: 'Casos Acumulados',
    data: [],
    fill: false,
    borderColor: 'rgb(41, 66, 166)',
    backgroundColor: 'rgb(41, 66, 166)',
    tension: 0.1,
  },
  {
    label: 'Casos Diários',
    data: [],
    fill: false,
    tension: 0.1,
  },
]
