import { Component, OnInit, Signal, computed } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DataService  } from 'src/app/services/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  barChartLegend = true;
  barChartPlugins = [];

  barChartData: Signal<ChartConfiguration<'bar'>['data']>;

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

      const foo = this.dataService.entries().map(entry => ({
        date: moment(entry.start).format('MMM D'),
        duration: Math.ceil((entry.stop - entry.start) / 1000 / 60),
        project: entry.project?.name || 'no-project',
      }));

      const entriesByProject: { [key: string]: { date: string; duration: number; project: string; }[] } = {};
      foo.forEach(entry => {
        if (!entriesByProject[entry.project]) {
          entriesByProject[entry.project] = [];
        }
        entriesByProject[entry.project].push(entry);
      });

      const dates = Array.from(new Set(foo.map(entry => entry.date)));
      const datasets = [];
      for (let project in entriesByProject) {
        const dataset: any = {
          data: [],
          label: project,
        };

        for (let date of dates) {
          const entriesByDate = entriesByProject[project].filter(entry => entry.date === date);
          const duration = entriesByDate.reduce((acc, entry) => acc + entry.duration, 0);
          dataset.data.push(duration);
        }
        datasets.push(dataset);
      }

      return {
        labels: dates,
        datasets,
      };

    });
  }

  ngOnInit() {


  }

}
