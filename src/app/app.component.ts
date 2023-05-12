import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'time-tracker';

  timer: moment.Moment | null = null;

  // lapsed$: BehaviorSubject<string> = new BehaviorSubject('');
  lapsed = '';

  constructor(
  ) {
  }

  ngOnInit(): void {
    setInterval(() => {
      if (this.timer) {
        const duration = moment.duration(this.timer.diff(this.getNow()));
        const asSec = Math.abs(Math.round(duration.asSeconds()));

        const hour = Math.floor(asSec / 60 / 60);
        const min = Math.floor(asSec / 60 - hour * 60);
        const sec = Math.floor(asSec - min * 60 - hour * 60 * 60);

        const hourStr = hour < 10 ? '0' + hour : hour;
        const minStr = min < 10 ? '0' + min : min;
        const secStr = sec < 10 ? '0' + sec : sec;


        this.lapsed = `${hourStr}:${minStr}:${secStr}`;
      }
    }, 1000);
  }

  getNow() {

    // return moment(1683613935000);

    return moment();

  }

  toggle(): void {

    if (!this.timer) {
      this.timer = moment();
    } else {
      this.timer = null;
    }

  }


}
