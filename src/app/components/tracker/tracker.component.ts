import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, interval, map } from 'rxjs';
import * as moment from 'moment';
import { DataService, Entry } from 'src/app/services/data.service';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackerComponent {

  elapsed$: Observable<string>;

  constructor(
    public dataService: DataService,
  ) {

    this.elapsed$ = interval(100).pipe(
      map(() => {
        if (this.dataService.currentEntry().start) {
          return this.getDuration(this.dataService.currentEntry().start || 0, this.getNowMs());
        }
        return '';
      }),
    );

  }

  getNowMs(): number {

    return Date.now();

  }

  getTimeString(dateMs: number): string {

    return new Date(dateMs).toLocaleTimeString();

  }

  startTimer(): void {

    this.dataService.updateCurrentEntry({ start: Date.now() });

  }

  stopTimer(): void {

    this.dataService.addEntry({
      project_id: this.dataService.currentEntry().project?.id || null,
      start: this.dataService.currentEntry().start || 0,
      stop: this.getNowMs(),
      description: this.dataService.currentEntry().description || '',
    });

    this.dataService.resetCurrentEntry();

  }

  trackAgain(entry: Entry) {

    this.dataService.updateCurrentEntry({
      project_id: entry.project?.id,
      description: entry.description,
      start: 0,
      stop: 0,
    });

    if (!this.dataService.currentEntry().start) {
      this.startTimer();
    }

  }

  parseIrek(date: string, timestamp: number): number {

    const parsed = date.split(':');

    let hours = parseInt(parsed[0]);
    const minutes = parseInt(parsed[1]);
    const parsed2 = parsed[2].split(' ');
    const seconds = parseInt(parsed2[0]);
    const ampm = parsed2[1];

    if (ampm.toUpperCase() === 'PM') {
      hours = hours + 12;
    }

    const newDate = moment(timestamp);

    newDate.hours(hours);
    newDate.minutes(minutes);
    newDate.seconds(seconds);

    return newDate.valueOf();

  }

  previousEntrySelected(entry: Entry) {

    this.dataService.updateCurrentEntry({
      project_id: entry?.project?.id,
      description: entry.description,
    });

    if (!this.dataService.currentEntry().start) {
      this.startTimer();
    }

  }

  getDuration(startMs: number, stopMs: number): string {

    const asSec = Math.abs((stopMs - startMs) / 1000);

    let hour = Math.floor(asSec / 60 / 60);
    let min = Math.floor(asSec / 60 - hour * 60);
    let sec = Math.floor(asSec - min * 60 - hour * 60 * 60);

    const hourStr = hour > 9 ? hour : '0' + hour;
    const minStr = min > 9 ? min : '0' + min;
    const secStr = sec > 9 ? sec : '0' + sec;

    return `${hourStr}:${minStr}:${secStr}`;

  }

  getDate(timestampMs: number) {

    return new Date(timestampMs);

  }

  updateEntryDate(e: any, entry: Entry) {

    const newStart = moment(e.value)
      .hour(moment(entry.start).hour())
      .minute(moment(entry.start).minute())
      .second(moment(entry.start).second());

    const newStop = moment(e.value)
      .hour(moment(entry.stop).hour())
      .minute(moment(entry.stop).minute())
      .second(moment(entry.stop).second());

    this.dataService.updateEntry(entry.id, {
      start: newStart.valueOf(),
      stop: newStop.valueOf()
    });

  }

}
