import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Entry {
  project_id: number;
  start: number;
  stop: number;
  description: string;
}

interface Project {
  id: number;
  name: string;
  color: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'time-tracker';

  startedTimeMs: number | null = null;
  elapsed = '';
  description = '';
  entries: { start: number; stop: number; description: string; }[] = [];
  projects: { name: string; color: string; }[] = [];

  constructor(
  ) {
  }

  ngOnInit(): void {

    const savedEntries = localStorage.getItem('entries');

    if (savedEntries) {
      this.entries = JSON.parse(savedEntries);
    }

    setInterval(() => {
      if (this.startedTimeMs) {
        this.elapsed = this.getDuration(this.startedTimeMs, this.getNowMs());
      }
    }, 300);
  }

  getNowMs(): number {

    return Date.now();

  }

  getTimeString(dateMs: number): string {

    return new Date(dateMs).toLocaleTimeString();

  }

  startTimer(): void {

    this.startedTimeMs = Date.now();

  }

  stopTimer(description: string): void {

    this.entries.push({
      start: this.startedTimeMs || 0,
      stop: this.getNowMs(),
      description,
    });

    localStorage.setItem('entries', JSON.stringify(this.entries));

    this.startedTimeMs = null;
    this.elapsed = '';

  }

  trackAgain(id: number) {

    // this.toggle()

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

}
