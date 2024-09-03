import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CandlestickChartComponent } from './candlestick-chart/candlestick-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CandlestickChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'test-chart-app';
}
