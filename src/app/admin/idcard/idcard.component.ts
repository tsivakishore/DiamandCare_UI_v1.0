import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-idcard',
  templateUrl: './idcard.component.html',
  styleUrls: ['./idcard.component.css']
})
export class IdcardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public downloadPDF() {
    return xepOnline.Formatter.Format('divEmpidCard', { render: 'download' });
  }

}
