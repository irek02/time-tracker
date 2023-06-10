import { Component, OnInit, Signal, computed } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  barChartLegend = true;
  barChartPlugins = [];

  barChartData: Signal<ChartConfiguration<'bar'>['data']>;
  // public barChartData: ChartConfiguration<'bar'>['data'] = {
  //   labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
  //   datasets: [
  //     { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
  //     { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
  //   ]
  // };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
    scales: {
      x: {
          stacked: true
      },
      y: {
          stacked: true
      }
    },
  };

  constructor(
    public dataService: DataService,
  ) {
    this.barChartData = computed(() => {

      const res: any = {};

      this.dataService.entries().forEach(entry => {
        const proj = entry.project?.name || 'no-project';
        if (!res[proj]) {
          res[proj] = [];
        }
        res[proj].push(Math.ceil((entry.stop - entry.start) / 1000 / 60));
      });

      console.log(res);

      return {
        labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
        datasets: [
          { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
          { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
        ]
      };

    });
  }

  ngOnInit() {


  }

}
