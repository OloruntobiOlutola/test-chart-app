import { Component, OnInit, HostListener } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {
  CandlestickController,
  OhlcController,
  CandlestickElement,
  OhlcElement,
} from 'chartjs-chart-financial';
import 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';
import { Subscription, interval } from 'rxjs';

Chart.register(...registerables);
Chart.register(
  CandlestickController,
  OhlcController,
  CandlestickElement,
  OhlcElement
);

@Component({
  selector: 'app-candlestick-chart',
  standalone: true,
  imports: [],
  templateUrl: './candlestick-chart.component.html',
  styleUrl: './candlestick-chart.component.css',
})
export class CandlestickChartComponent implements OnInit {
  chart: any;
  candleData: any[] = [];
  subscription: Subscription | undefined;
  isTapped: boolean = false;

  ngOnInit() {
    this.initializeChart();
    this.subscription = interval(10000).subscribe(() => {
      this.addNewCandlestick();
    });
  }

  initializeChart() {
    this.chart = new Chart('candlestickChart', {
      type: 'candlestick',
      data: {
        datasets: [
          {
            label: 'Cryptocurrency',
            data: this.candleData,
            borderColor: '#00FF00',
            borderWidth: 1,
            backgroundColor: '#FF0000',
            borderSkipped: 'bottom',
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: { unit: 'second', tooltipFormat: 'PPPpp' },
          },
          y: {
            beginAtZero: true,
          },
        },
        animation: false,
      },
    });
  }

  addNewCandlestick() {
    const randomCandle = this.generateRandomCandle();
    this.candleData.push(randomCandle);

    if (this.candleData.length > 20) {
      this.candleData.shift();
    }

    this.chart.options.scales.y.min = this.calculateMinY();
    this.chart.options.scales.y.max = this.calculateMaxY();

    this.chart.update();
  }

  calculateMinY() {
    const lowValues = this.candleData.map((candle) => candle.l);
    const minY = Math.min(...lowValues) - 1;
    return minY;
  }

  calculateMaxY() {
    const highValues = this.candleData.map((candle) => candle.h);
    const maxY = Math.max(...highValues) + 1;
    return maxY;
  }

  generateRandomCandle() {
    const open = this.candleData.length
      ? this.candleData[this.candleData.length - 1].c
      : 100;
    const close = this.isTapped
      ? open + Math.random() * 5
      : open - Math.random() * 5;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;

    return {
      x: new Date().getTime(),
      o: open,
      h: high,
      l: low,
      c: close,
    };
  }

  onChartTap() {
    this.isTapped = true;
    setTimeout(() => (this.isTapped = false), 10000);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
