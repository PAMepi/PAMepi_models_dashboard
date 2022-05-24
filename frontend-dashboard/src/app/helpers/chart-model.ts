export const chartModelOptions: Highcharts.Options = {
  title: {
    text: undefined,
  },
  chart: {
    backgroundColor: '#eeeeee',
  },
  credits: {
    enabled: false
},
  series: [],
  xAxis: {
    gridLineWidth: 2,
    type: 'datetime',
    dateTimeLabelFormats: {
      month: '%e. %b',
      year: '%b',
    },
  },
  yAxis:{
    title: {
      text: 'População'
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
  exporting: {
    buttons: {
      contextButton: {
        menuItems: ['downloadCSV', 'downloadSVG','downloadPDF', 'downloadPNG'],
      },

    },
  },
 navigation:{
  buttonOptions:{
    theme:{
     fill:'#eeeeee',
     stroke:'none'

    }
  }
 }
};
