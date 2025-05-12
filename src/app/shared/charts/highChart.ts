import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';

// Initialize Highcharts modules
HighchartsMore(Highcharts);
SolidGauge(Highcharts);
export function gaugeChart({ id, seriesData, color, sizes, fontSize, labelPlacement, fontColor, bgColor }: { id: string, seriesData: number, color: string, sizes: string, fontSize?: string, labelPlacement?: number, fontColor?: string, bgColor?: string }) {

  Highcharts.chart(id, {
    chart: {
      type: 'solidgauge',
      margin: 0, // Remove margins to fit the gauge snugly
      backgroundColor: bgColor
    },
    credits: {
      enabled: false,
    },
    title: {
      text: '',
    },
    pane: {
      center: ['50%', '50%'], // Center the gauge vertically and horizontally
      size: sizes, // Full size of the container
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: '#EEE',
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }
    },
    tooltip: {
      enabled: false,
    },
    yAxis: {
      stops: [
        [1, color],
      ],
      min: 0,
      max: 100,
      lineWidth: 0,
      minorTickInterval: null,
      tickAmount: 0,
      tickPositions: [], // Remove all ticks

      title: {
        text: '',
      },
      labels: {
        enabled: false,
      },
      color: 'red'
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: true,
          y: labelPlacement,
          borderWidth: 0,
          useHTML: true,
          format: ''
        }
      }
    },
    series: [{
      center: ['50%', '50%'],
      type: 'solidgauge',
      name: 'Progress',
      data: [seriesData],
      dataLabels: {
        format: `<div style="text-align:center"><span style="font-size:${fontSize};color:${fontColor}">{y}%</span></div>`
      },
    }]
  } as any);
}
