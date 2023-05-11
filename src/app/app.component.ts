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
        const duration = moment.duration(this.getNow().diff(this.timer));
        const asSec = Math.round(duration.asSeconds());
        const asMins = Math.round(duration.asMinutes());
        const asHours = Math.round(duration.asHours());

        const hour = asHours;
        const min = asMins - asHours * 60;
        const sec = asSec - asMins * 60;

        const hourStr = hour < 10 ? '0' + hour : hour;
        const minStr = min < 10 ? '0' + min : min;
        const secStr = sec < 10 ? '0' + sec : sec;

        console.log(new Date(asSec * 1000).toISOString().substring(11, 19))
        console.log(new Date(asSec * 1000).toISOString())

        this.lapsed = `${hourStr}:${minStr}:${secStr}`;
      }
    }, 1000);
  }

  getNow() {

    return moment(1683594000000);

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
