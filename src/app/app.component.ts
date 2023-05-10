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
        this.timer.diff(moment());
        const asMs = moment.duration(moment().diff(this.timer)).asMilliseconds();
        const foo = moment.utc(asMs).format("hh:mm:ss");
        this.lapsed = moment.utc(moment().diff(this.timer)).format("hh:mm:ss");
        console.log(moment(this.timer).fromNow());
        // this.lapsed = asMs.toString();
      }
    }, 200);
  }

  toggle(): void {

    if (!this.timer) {
      this.timer = moment();
    } else {
      this.timer = null;
    }

  }


}
