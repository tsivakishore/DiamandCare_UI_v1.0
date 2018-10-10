import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from "../../utility/shared-service/shared.service";
import { Router } from "@angular/router";
import { RouteConstants } from "../../utility/constants/routes";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { BaseComponent } from "../../utility/base-component/base.component";
import { CommonRegexp } from "../../utility/constants/validations";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { API } from "../../utility/constants/api";
import { dialog, slideUp } from "../animation";
import { TranslateService } from "../../utility/translate/translate.service";
import { style, transition, animate, trigger } from "@angular/animations";
import { UserService } from "../../utility/shared-service/user.service";
import { CommonService } from '../../utility/shared-service/common.service';
import { CoursemasterService } from '../../utility/shared-service/coursemaster.service';
import { LoanEarnsService } from '../../utility/shared-service/loanEarns.service';
import { CommonFunctions } from "../../utility/common-functions";

@Component({
  selector: 'app-studentmapping',
  templateUrl: './studentmapping.component.html',
  styleUrls: ['./studentmapping.component.css'],
  providers: [CommonService, UserService, CoursemasterService, LoanEarnsService],
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

export class StudentmappingComponent extends BaseComponent implements OnInit {
  @ViewChild('txtSearcByLoanId') txtSearcByLoanId: ElementRef;
  activeForm: number = 1;
  activeModal: number = 1;
  UserDetails: any;
  LoginUserDetails: any;
  frmGenerateOTPForm: FormGroup;
  registerStudentMappingForm: FormGroup;
  frmVerifyOTPForm: FormGroup;
  commonFunctions = new CommonFunctions();
  resultUserID: number;
  lstFeeMasters: any;
  listOfEarnLoans: any;
  loginUserID: number;
  defaultCourseID: number;
  defaultFee: any;
  defaultGroup: any;
  isChecked: boolean = false;
  errorMessage: string;
  isValidChecked: boolean = false;

  constructor(public fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    private sharedService: SharedService,
    private userService: UserService,
    private coursemasterService: CoursemasterService,
    private loanEarnsService: LoanEarnsService,
    public vcr: ViewContainerRef,
    private router: Router,
    private commonService: CommonService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.LoginUserDetails = this.sharedService.getUser();
    this.loginUserID = this.LoginUserDetails.UserID;
    this.createGenerateOTPForm();
  }

  createGenerateOTPForm() {
    this.frmGenerateOTPForm = this.fb.group({
      UserID: [0],
      UserName: [''],
      FirstName: [''],
      LastName: [''],
      OneTimePassword: [''],
      PhoneNumber: [''],
      Email: [''],
      HaveOTP: false
    })
  }

  createVerifyOTPForm() {
    this.frmVerifyOTPForm = this.fb.group({
      UserID: [0],
      OneTimePassword: new FormControl('', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])),
    })
  }

  createStudentForm() {
    this.registerStudentMappingForm = this.fb.group({
      UserID: [0],
      StudentName: new FormControl('', Validators.compose([Validators.required, Validators.min(3), Validators.pattern(CommonRegexp.ALPHA_NUMERIC)])),
      Gender: new FormControl('', Validators.compose([Validators.required])),
      Address1: new FormControl('', Validators.compose([Validators.min(3)])),
      Address2: new FormControl('', Validators.compose([Validators.min(3)])),
      City: new FormControl('', Validators.compose([Validators.min(2)])),
      District: new FormControl('', Validators.compose([Validators.min(2)])),
      State: new FormControl('', Validators.compose([Validators.min(2)])),
      Country: new FormControl('', Validators.compose([Validators.min(2)])),
      // Zipcode: new FormControl('', Validators.compose([Validators.min(6), Validators.max(6), Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])),
      Zipcode: new FormControl('', Validators.compose([Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])),
      FeeMasterID: new FormControl('', Validators.compose([Validators.required])),
      GroupID: new FormControl('', Validators.compose([Validators.required])),
      CourseFee: new FormControl('', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])),
      ApprovalStatusID: [''],
      TransferStatusID: ['']
    })
  }

  public onSearchChange(searchValue: string) {
    if (!!searchValue && searchValue.trim().length >= 5) {
      this.sharedService.setLoader(true);
      this.isValidChecked = false;
      this.userService._getUserDetailsByDCIDorName(searchValue).subscribe((res: any) => {
        this.sharedService.setLoader(false);
        if (res.m_Item1) {
          this.UserDetails = res.m_Item3;
          this.frmGenerateOTPForm.patchValue({
            UserID: this.UserDetails.UserID,
            UserName: this.UserDetails.UserName,
            FirstName: this.UserDetails.FirstName,
            LastName: this.UserDetails.LastName,
            PhoneNumber: this.UserDetails.PhoneNumber,
            Email: this.UserDetails.Email
          })
        }
        else {
          this.frmGenerateOTPForm.reset();
          this.toastr.error("Please provide valid user name or DCID");
        }
      }, err => {
        this.frmGenerateOTPForm.reset();
        this.sharedService.setLoader(false);
        this.toastr.error("Oops! There has been an error from server. Please try again.");
      })
    }
  }

  // Generate OTP form submit method
  onGenerateOTP(formGenerateOTP, isValidForm) {
    if (isValidForm) {
      formGenerateOTP.OneTimePassword = this.getOTP(100000, 999999);
      this.apiManager.postAPI(API.GENERATEOTP, formGenerateOTP).subscribe(response => {
        if (response.m_Item1) {
          this.createVerifyOTPForm();
          this.resultUserID = response.m_Item3.UserID
          this.activeModal = 2;
          this.activeForm = 2;
        }
        else {
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.toastr.error("Oops! There has been an error from server. Please try again.");
      })
    }
  }

  // Verify OTP form submit method
  VerifyStudentOTP(formVerifyOTPForm, isValidForm) {
    if (isValidForm) {
      debugger;
      formVerifyOTPForm.UserID = this.resultUserID;
      this.apiManager.postAPI(API.VERIFYSTUDENTOTP, formVerifyOTPForm).subscribe(response => {
        if (response.m_Item1) {
          this.createStudentForm();
          debugger;
          this.registerStudentMappingForm.controls['UserID'].setValue(this.UserDetails.UserID, { onlySelf: true });
          this.getFeeMasters(this.loginUserID);
          this.GetLoans();
          this.activeModal = 3;
          this.activeForm = 3;
        }
        else {
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.toastr.error("Oops! There has been an error from server. Please try again.");
      })
    }
    else {
      this.toastr.error("Form is invalid");
    }
  }

  onSubmitStudentingMapping(formStudentMapping, isValidForm) {
    if (isValidForm) {
      formStudentMapping.ApprovalStatusID = 3;
      formStudentMapping.TransferStatusID = 1;
      this.apiManager.postAPI(API.STUDENTMAPPING, formStudentMapping).subscribe(response => {
        if (response.m_Item1) {
          this.viewStudentMappingDetailsForm();
        }
        else {
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.toastr.error("Oops! There has been an error from server. Please try again.");
      })
    }
    else {
      this.toastr.error("Form is not valid");
    }
  }

  getFeeMasters(UserID: number) {
    this.sharedService.setLoader(true);
    this.lstFeeMasters = [];
    this.coursemasterService._getFeeMastersByUserID(UserID).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstFeeMasters = res.m_Item3;
        this.defaultCourseID = this.lstFeeMasters[0].FeeMasterID;
        this.defaultFee = this.lstFeeMasters[0].CourseFee;
        this.registerStudentMappingForm.controls['FeeMasterID'].setValue(this.defaultCourseID, { onlySelf: true });
        this.registerStudentMappingForm.controls['Gender'].setValue('M', { onlySelf: true });
        this.registerStudentMappingForm.controls['CourseFee'].setValue(this.defaultFee, { onlySelf: true })
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  public GetLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getLoans().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listOfEarnLoans = res.m_Item3;
        this.defaultGroup = this.listOfEarnLoans[0].Groups;
        this.registerStudentMappingForm.controls['GroupID'].setValue(this.defaultGroup, { onlySelf: true });
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  onFeeMasterChange(selectedValue: any) {
    this.defaultFee = '';
    this.defaultFee = this.lstFeeMasters.find(x => x.FeeMasterID == selectedValue).CourseFee;
    this.registerStudentMappingForm.controls['CourseFee'].setValue(this.defaultFee, { onlySelf: true })
  }

  onCheckedChange(isCheckboxClicked, formGenerateOTP, isValidForm) {
    debugger;
    if (isCheckboxClicked == "on" && isValidForm) {
      this.apiManager.postAPI(API.GENERATEOTP, formGenerateOTP).subscribe(response => {
        if (response.m_Item1) {
          this.createVerifyOTPForm();
          this.resultUserID = response.m_Item3.UserID
          this.activeModal = 2;
          this.activeForm = 2;
        }
        else {
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.toastr.error("Oops! There has been an error from server. Please try again.");
      })
    }
    else {
      this.isChecked = false;
      this.isValidChecked = true;
      this.frmGenerateOTPForm.patchValue({
        HaveOTP: false
      })
      this.errorMessage = "Please provide the user name or DCID"
    }
  }

  viewStudentMappingDetailsForm() {
    this.router.navigate(["/" + RouteConstants.STUDENTMAPPINGDETAILS]);
  }

  restrictSpace(e) {
    if (e.which === 32)
      e.preventDefault();
  }

  Gender = [
    { GenderID: "M", Gender: "Male" },
    { GenderID: "F", Gender: "Female" }
  ];

}
