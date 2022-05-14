import { Options } from 'highcharts';
import mapBrazil from './brazil.geo.json';



function pointClick(evento: any) {
  console.log(evento);
}

export const chartMapOptions: Options = {
  chart: {
    map: mapBrazil,
  },
  title: {
    text: 'Highmaps basic',
  },
  subtitle: {
    text: 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world.js">World, Miller projection, medium resolution</a>',
  },
  mapNavigation: {
    enabled: true,
    buttonOptions: {
      alignTo: 'spacingBox',
    },
  },
  legend: {
    enabled: true,
  },
  colorAxis: {
    min: 0,
    minColor: '#FFBBB0',
    maxColor: '#6A1015',

  },
  series: [
    {
      type: 'map',
      name: 'Random data',
      point: {
        events: {
          click: function (oEvent) {
            pointClick(oEvent.point.name);
          },
        },
      },
      states: {
        hover: {
          color: '#57423F',
        },
      },
      dataLabels: {
        enabled: true,
        format: '{point.name}',
      },
      allAreas: false,
      data: [
        ['br-sp', 10],
        ['br-ma', 11],
        ['br-pa', 12],
        ['br-sc', 13],
        ['br-ba', 14],
        ['br-ap', 15],
        ['br-ms', 16],
        ['br-mg', 17],
        ['br-go', 18],
        ['br-rs', 19],
        ['br-to', 20],
        ['br-pi', 21],
        ['br-al', 22],
        ['br-pb', 23],
        ['br-ce', 24],
        ['br-se', 25],
        ['br-rr', 26],
        ['br-pe', 27],
        ['br-pr', 28],
        ['br-es', 29],
        ['br-rj', 30],
        ['br-rn', 31],
        ['br-am', 32],
        ['br-mt', 33],
        ['br-df', 34],
        ['br-ac', 35],
        ['br-ro', 36],
      ],
    },
  ],
};

