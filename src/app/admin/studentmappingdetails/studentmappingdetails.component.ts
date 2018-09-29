import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from "../../utility/shared-service/shared.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastsManager } from "ng2-toastr";
import { BaseComponent } from "../../utility/base-component/base.component";
import { RouteConstants } from "../../utility/constants/routes";
import { CommonRegexp } from "../../utility/constants/validations";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { dialog, slideUp } from "../animation";
import { TranslateService } from "../../utility/translate/translate.service";
import { style, transition, animate, trigger } from "@angular/animations";
import { UserService } from "../../utility/shared-service/user.service";
import { CommonService } from '../../utility/shared-service/common.service';
import { CoursemasterService } from '../../utility/shared-service/coursemaster.service';
import { CommonFunctions } from "../../utility/common-functions";

@Component({
  selector: 'app-studentmappingdetails',
  templateUrl: './studentmappingdetails.component.html',
  styleUrls: ['./studentmappingdetails.component.css'],
  providers: [CommonService, CoursemasterService],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.8, .8, .8)' }),
        animate(300)
      ]),
      transition('* => void', [
        animate(200, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ]),
    slideUp, dialog
  ]
})

export class StudentmappingdetailsComponent extends BaseComponent implements OnInit {

  LoginUserDetails: any;
  loginUserID: number;
  lstStudentMappingDetails: any;
  isController= true; 

  constructor(public fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    private router: Router,
    private sharedService: SharedService,
    private coursemasterService: CoursemasterService,
    public vcr: ViewContainerRef,
    private commonService: CommonService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.LoginUserDetails = this.sharedService.getUser();
    this.loginUserID = this.LoginUserDetails.UserID;
    this.getStudentMappingDetails(this.loginUserID);
  }

  getStudentMappingDetails(UserID: number) {
    this.sharedService.setLoader(true);
    this.lstStudentMappingDetails = [];
    this.coursemasterService._getStudentMappingDetails(UserID).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstStudentMappingDetails = res.m_Item3;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  checkLoanEligibility(LoanStatus: string, Groups: number) {
    if (LoanStatus == "NotEligible") {
      return true;
    }
    else if (LoanStatus == "Eligible") {
      return false;
    }
  }

  colorCode(LoanStatus: string) {
    if (LoanStatus == "NotEligible") {
      return "btnnoteligible";
    }
    else if (LoanStatus == "Eligible") {
      return "btneligible";
    }
  }

  viewStudentMappingsForm() {
    this.router.navigate(["/" + RouteConstants.STUDENTMAPPING]);
  }

}
