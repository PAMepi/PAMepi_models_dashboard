export const chartRtOptions: Highcharts.Options = {
  title: {
    text: undefined,
  },
  chart: {
    backgroundColor: '#eeeeee',
  },
  series: [ ],
  xAxis: {
    gridLineWidth: 2,
    type: 'datetime',
    dateTimeLabelFormats: {
      month: '%e. %b',
      year: '%b',
    },
  },
  plotOptions: {
    series: {
      pointStart: Number(new Date()),
      pointInterval: 24 * 3600 * 1000,
    },
  },
  legend: {
    align: 'center',
    verticalAlign: 'top',
  },
};

