import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DataService } from 'src/app/services/data.service';
import * as moment from 'moment';
import * as dayjs from 'dayjs'

interface Entry {
  date: string;
  duration: number;
  project: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  ranges: any = {
    'Today': [dayjs(), dayjs()],
    'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  barChartLegend = true;
  barChartData!: ChartConfiguration<'bar'>['data'];
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

  constructor(private dataService: DataService) {}

  foo(e: {startDate: dayjs.Dayjs, endDate: dayjs.Dayjs }) {
    console.log(e);
  }

  ngOnInit() {

    this.barChartData = this.generateChartData();

  }

  private generateChartData(): ChartConfiguration<'bar'>['data'] {
    const entries: Entry[] = this.dataService.entries().map(entry => ({
      date: moment(entry.start).format('MMM D'),
      duration: Math.ceil((entry.stop - entry.start) / 1000 / 60 / 60),
      project: entry.project?.name || 'no-project',
    }));

    const entriesByProject: { [key: string]: Entry[] } = {};
    entries.forEach(entry => {
      if (!entriesByProject[entry.project]) {
        entriesByProject[entry.project] = [];
      }
      entriesByProject[entry.project].push(entry);
    });

    const dates = Array.from(new Set(entries.map(entry => entry.date)));
    const datasets = [];
    for (let project in entriesByProject) {
      const dataset: any = {
        data: [],
        label: project,
        backgroundColor: this.dataService.projects().find(p => p.name === project)?.color,
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
  }
}
