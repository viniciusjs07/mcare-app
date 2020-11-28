import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  readonly SCHEDULE_PROFESSIONAL = 'professionais';
  readonly SCHEDULE_CID = 'cid';
  readonly COMPANY_PATIENT = 'patient';

  state = this.SCHEDULE_PROFESSIONAL;

  constructor() { }

  ngOnInit() {
    if (this.state === 'professionais') {
      $('#status1').addClass('active');
    }
  }

}
