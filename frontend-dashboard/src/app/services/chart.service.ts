import { SIR } from '../models/SIR';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class ChartService {
  SIR!: SIR;
  baseUrl: string = 'https://polar-cliffs-29261.herokuapp.com/api';

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
}
