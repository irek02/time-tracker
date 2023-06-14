import { Component, OnInit, Signal, computed, signal } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DataService, Entry } from 'src/app/services/data.service';
import * as moment from 'moment';
import * as dayjs from 'dayjs'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  ranges: any = {
    'Today': [dayjs(), dayjs()],
    'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'This Week': [dayjs().startOf('week'), dayjs()],
    'Last Week': [dayjs().subtract(1, 'week').startOf('week'), dayjs().subtract(1, 'week').endOf('week')],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }
  barChartData!: Signal<ChartConfiguration<'bar'>['data']>;
  selectedDates = signal({ startDate: dayjs().startOf('week'), endDate: dayjs() });
  barChartLegend = true;
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {

    this.barChartData = computed(() => {
      const { startDate, endDate } = this.selectedDates();
      const filteredEntries = this.dataService.entries()
        .filter(entry => entry.start > startDate.valueOf() && entry.start < endDate.valueOf())
        // Sort by putting more recent entries to the end.
        .sort((a, b) => a.start > b.start ? 1 : -1);
      return this.generateChartData(filteredEntries);
    });

  }

  onCalendarChange(e: { startDate: dayjs.Dayjs, endDate: dayjs.Dayjs }) {

    if (e.endDate && e.startDate) {
      this.selectedDates.set(e);
    }

  }

  private generateChartData(entries: Entry[]): ChartConfiguration<'bar'>['data'] {
    const newEntries: { date: string, duration: number, project: string }[] = entries.map(entry => ({
      date: moment(entry.start).format('MMM D'),
      duration: Math.ceil((entry.stop - entry.start) / 1000 / 60 / 60),
      project: entry.project?.name || 'no-project',
    }));

    const entriesByProject: { [key: string]: { date: string, duration: number, project: string }[] } = {};
    newEntries.forEach(entry => {
      if (!entriesByProject[entry.project]) {
        entriesByProject[entry.project] = [];
      }
      entriesByProject[entry.project].push(entry);
    });

    const dates = Array.from(new Set(newEntries.map(entry => entry.date)));
    const datasets = [];
    for (let project in entriesByProject) {
      const dataset: any = {
        data: [],
        label: project,
        backgroundColor: this.dataService.projects().find(p => p.name === project)?.color || 'purple',
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
