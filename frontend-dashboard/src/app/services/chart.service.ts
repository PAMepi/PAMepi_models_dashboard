import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  baseUrl: string = 'https://app-dashboard-covid.herokuapp.com/api';


  constructor(private http: HttpClient) {}

  updateChartSIR(
    population: number,
    transmission: number,
    recovery: number,
    infected: number,
    incubation: number
  ) {
    let url =
      `${this.baseUrl}/seir?N=${population}` +
      `&beta=${transmission}` +
      `&gamma=${recovery}` +
      `&alpha=${incubation}` +
      `&I0=${infected}`;
    return this.http.get(url);
  }


  updateChartSEIR(
    population: number,
    transmission: number,
    recovery: number,
    infected: number,
    incubation: number
  ) {
    let url =
    `${this.baseUrl}/seir?N=${population}` +
    `&beta=${transmission}` +
    `&gamma=${recovery}` +
    `&alpha=${1/incubation}` +
    `&I0=${infected}`;
    return this.http.get(url);
  }

  updateChartSEIIR(
    population: number,
    transmission: number,
    recovery: number,
    infected: number,
    incubation: number, gammaa:number, rho:number
  ) {
    let url =
    `${this.baseUrl}/seiir?N=${population}` +
    `&beta=${transmission}` +
    `&gamma=${recovery}` +
    `&alpha=${1/incubation}` +
    `&I0=${infected}` +
    `&gammaa=${gammaa}` +
    `&rho=${rho}`;
    return this.http.get(url);
  }
}
