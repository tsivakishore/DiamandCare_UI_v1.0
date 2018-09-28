import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from "../../utility/shared-service/shared.service";
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
import { CommonFunctions } from "../../utility/common-functions";

@Component({
  selector: 'app-studentmapping',
  templateUrl: './studentmapping.component.html',
  styleUrls: ['./studentmapping.component.css'],
  providers: [CommonService, UserService],
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
  frmGenerateOTPForm: FormGroup;
  registerStudentMappingForm: FormGroup;
  frmVerifyOTPForm: FormGroup;
  commonFunctions = new CommonFunctions();
  resultOTP: number;
  resultUserID: number;

  constructor(public fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    private sharedService: SharedService,
    private userService: UserService,
    public vcr: ViewContainerRef,
    private commonService: CommonService) {
    super(toastr, vcr);
  }

  ngOnInit() {
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
      Email: ['']
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
      Zipcode: new FormControl('', Validators.compose([Validators.min(6), Validators.max(6), Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])),
      CourseMasterID: new FormControl('', Validators.compose([Validators.required])),
      CourseID: new FormControl('', Validators.compose([Validators.required])),
      GroupID: new FormControl('', Validators.compose([Validators.required])),
      Fees: new FormControl('', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])),
      ApprovalStatusID: [''],
      TransferStatusID: ['']
    })
  }

  public onSearchChange(searchValue: string) {
    if (!!searchValue && searchValue.trim().length >= 5) {
      this.sharedService.setLoader(true);
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
            Email: this.UserDetails.Email,
            OneTimePassword: this.getOTP(100000, 999999)
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
      this.apiManager.postAPI(API.GENERATEOTP, formGenerateOTP).subscribe(response => {
        if (response.m_Item1) {
          this.createVerifyOTPForm();
          this.resultUserID = response.m_Item3.UserID
          this.resultOTP = response.m_Item3.OneTimePassword;
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
  VerifyOTP(OTP, isValidForm) {
    debugger;
    if (isValidForm) {
      if (parseInt(OTP) === this.resultOTP) {
        this.createStudentForm();
        this.activeModal = 3;
        this.activeForm = 3;
      }
      else {
        this.toastr.error("Your OTP is incorrect.Please enter correct OTP.");
      }
    }
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
