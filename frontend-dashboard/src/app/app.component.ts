import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables, ChartType } from 'chart.js';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

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

  dadosDigitados: Dados = {
    inicialInfectados: 1,
    taxaRecuperacao: 0.2,
    totalPopulacao: 5000,
    taxaContato: 0.5,
  };

  chart: any;


  constructor(private observer: BreakpointObserver, private http: HttpClient) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.gerarGrafico();
    this.atribuirValores();

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

  gerarGrafico() {
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



  atribuirValores() {
    this.removeData(this.chart);
    let url =
      `https://polar-cliffs-29261.herokuapp.com/api/sir?N=${this.dadosDigitados.totalPopulacao}` +
      `&beta=${this.dadosDigitados.taxaContato}` +
      `&gamma=${this.dadosDigitados.taxaRecuperacao}` +
      `&I0=${this.dadosDigitados.inicialInfectados}`;

    this.http.get(url).subscribe((res) => this.addData(this.chart, res));
  }

  // sendLabel(){

  // }

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

interface Dados {
  totalPopulacao: number;
  inicialInfectados: number;
  taxaContato: number;
  taxaRecuperacao: number;
}
