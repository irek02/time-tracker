import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'time-tracker';

  constructor(
    private modalService: NgbModal,
  ) {
  }

  open(modal: any): void {
    this.modalService.open(modal);
  }

}
