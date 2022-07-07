export const chartModelOptions: Highcharts.Options = {
  title: {
    text: undefined,
  },
  chart: {
    backgroundColor: '#eeeeee',
    type:"area"
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
    area: {
      stacking: 'normal',
      lineColor: '#666666',
      lineWidth: 1,
      marker: {
          lineWidth: 1,
          lineColor: '#666666'
      }
    },
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
