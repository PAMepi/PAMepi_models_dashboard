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
    mu: number = 0
  ) {
    let url =
      `${this.baseUrl}/sir?N=${population}` +
      `&beta=${transmission}` +
      `&gamma=${recovery}` +
      `&I0=${infected}` +
      `&mu=${mu}`;
    return this.http.get(url);
  }


  updateChartSEIR(
    population: number,
    transmission: number,
    recovery: number,
    infected: number,
    incubation: number,
    mu: number = 0
  ) {
    let url =
    `${this.baseUrl}/seir?N=${population}` +
    `&beta=${transmission}` +
    `&gamma=${recovery}` +
    `&alpha=${1/incubation}` +
    `&I0=${infected}` +
    `&mu=${mu}`;
    return this.http.get(url);
  }

  updateChartSEIIR(
    population: number,
    transmission: number,
    recovery: number,
    infected: number,
    incubation: number, gammaa:number, rho:number,
    mu:number = 0
  ) {
    let url =
    `${this.baseUrl}/seiir?N=${population}` +
    `&beta=${transmission}` +
    `&gamma=${recovery}` +
    `&alpha=${1/incubation}` +
    `&I0=${infected}` +
    `&gammaa=${gammaa}` +
    `&rho=${rho}` +
    `&mu=${mu}`;
    return this.http.get(url);
  }
}
