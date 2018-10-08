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
import { API } from "../../utility/constants/api";

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
  isShowModal: number = 1;
  LoginUserDetails: any;
  loginUserID: number;
  lstStudentMappingDetails: any;
  isController = true;
  oTPForm: FormGroup;

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

  createOTPForm() {
    this.oTPForm = this.fb.group({
      UserID: [0],
      PhoneNumber: [''],
      LoanOTP: new FormControl('', Validators.compose([Validators.required, <any>Validators.pattern(CommonRegexp.NUMERIC_REGEXP)]))
    })
  }


  getStudentMappingDetails(UserID: number) {
    this.sharedService.setLoader(true);
    this.lstStudentMappingDetails = [];
    this.coursemasterService._getStudentMappingDetails(UserID).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstStudentMappingDetails = res.m_Item3;
        //console.log(this.lstStudentMappingDetails);
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  GenerateLoanOTP(selectedRow: any) {
    this.createOTPForm();
    this.oTPForm.patchValue({
      UserID: selectedRow.UserID,
      PhoneNumber: selectedRow.PhoneNumber,
      LoanOTP: this.getOTP(100000, 999999)
    })
    this.apiManager.postAPI(API.GENERATELOANOTP, this.oTPForm.value).subscribe(response => {
      if (response.m_Item1) {
        this.createOTPForm();
        this.isShowModal = 2;
      }
      else {
        this.toastr.error(response.m_Item2);
      }
    }, err => {
      this.toastr.error("Oops! There has been an error from server. Please try again.");
    })
  }

  SubmitOTP(formApplyLoan: any, isValid) {

  }

  checkLoanEligibility(ApprovalStatus: string, Groups: number) {
    if (ApprovalStatus == "Approval Pending") {
      return true;
    }
    else if (ApprovalStatus == "Approved") {
      return false;
    }
  }

  colorCode(ApprovalStatus: string) {
    if (ApprovalStatus == "Approval Pending") {
      return "btnnoteligible";
    }
    else if (ApprovalStatus == "Approved") {
      return "btneligible";
    }
  }

  viewStudentMappingsForm() {
    this.router.navigate(["/" + RouteConstants.STUDENTMAPPING]);
  }

}
