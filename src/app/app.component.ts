import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'time-tracker';

  startedTimeMs: number | null = null;
  elapsed = '';
  entries: { start: number; stop: number }[] = [];

  constructor(
  ) {
  }

  ngOnInit(): void {
    setInterval(() => {
      if (this.startedTimeMs) {
        this.elapsed = this.getDuration(this.startedTimeMs, this.getNowMs());
      }
    }, 300);
  }

  getNowMs(): number {

    return Date.now();

  }

  toggle(): void {

    if (!this.startedTimeMs) {
      this.startedTimeMs = Date.now();
    } else {
      this.entries.push({ start: this.startedTimeMs, stop: this.getNowMs() });
      this.startedTimeMs = null;
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

}
