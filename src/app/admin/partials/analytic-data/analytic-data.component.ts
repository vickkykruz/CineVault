import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-analytic-data',
  templateUrl: './analytic-data.component.html',
  styleUrls: ['./analytic-data.component.scss']
})
export class AnalyticDataComponent {

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ 'Comedy', 'Sci-fi', 'Horror', 'Romance', 'Action', 'Adventure', 'Thriller', 'Drama', 'Mystery', 'Crime', 'Animation', 'Fantasy' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40, 0, 30, 26, 55, 87 ], label: 'Movies Gentics' }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };


  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = [ [ 'Download'], 'user' ];
  public pieChartDatasets = [ {
    data: [ 39000, 15000]
  } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];
}
