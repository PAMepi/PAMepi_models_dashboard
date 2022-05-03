import { Component, OnInit } from '@angular/core';
import { MapChart } from 'angular-highcharts';
import { chartMapOptions } from 'src/app/helpers/chart-map';

@Component({
  selector: 'app-chart-maps',
  templateUrl: './chart-maps.component.html',
  styleUrls: ['./chart-maps.component.css']
})
export class ChartMapsComponent implements OnInit {
  chartMap:MapChart = new MapChart(chartMapOptions)

  constructor() { }

  ngOnInit(): void {
  }

}
