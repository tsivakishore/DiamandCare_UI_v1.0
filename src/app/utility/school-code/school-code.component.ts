import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonService } from "../../utility/shared-service/common.service";

@Component({
  selector: 'app-school-code',
  templateUrl: './school-code.component.html',
  styleUrls: ['./school-code.component.css'],
  providers: [CommonService]
})
export class SchoolCodeComponent implements OnInit {

  @Output() changeSchool: EventEmitter<string> = new EventEmitter();

  schoolDetails: any;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.GetSchoolDetails();
  }

  public GetSchoolDetails() {
    this.commonService._getSchoolDetails().subscribe((res: any) => {
      if (res.m_Item1) {
        this.schoolDetails = res.m_Item3;
      }
    }, err => {
      console.log(err);
    })
  }

  onSchoolChange(event) {
    this.changeSchool.emit(event);
  }
}
