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
  frmStudentForm: FormGroup;
  commonFunctions = new CommonFunctions();

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
    this.createStudentForm();
  }

  createStudentForm() {
    this.frmStudentForm = this.fb.group({
      UserID: [0],
      UserName: [''],
      OneTimePassword: [''],
      PhoneNumber: [''],
      Email: ['']
    })
  }

  public onSearchChange(searchValue: string) {
    if (!!searchValue && searchValue.trim().length >= 5) {
      this.sharedService.setLoader(true);
      this.userService._getUserDetailsByDCIDorName(searchValue).subscribe((res: any) => {
        this.sharedService.setLoader(false);
        if (res.m_Item1) {
          debugger;
          this.UserDetails = res.m_Item3;
          this.frmStudentForm.patchValue({
            UserID: this.UserDetails.UserID,
            UserName: this.UserDetails.UserName,
            PhoneNumber: this.UserDetails.PhoneNumber,
            Email: this.UserDetails.Email,
            OneTimePassword: this.getOTP(100000, 999999)
          })
        }
        else
          this.toastr.error("Please provide valid user name or DCID");
      }, err => {
        this.sharedService.setLoader(false);
      })
    }
  }

  // Generate OTP form submit method
  onGenerateOTP(formStudent, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.GENERATEOTP, formStudent).subscribe(response => {
        if (response.m_Item1) {
          // this.validSecretKey = formValue.RegKey;
          // this.validPhoneNumber = formValue.PhoneNumber;
          // this.keyType = response.m_Item3;
          // this.createRegisterForm();
          // this.registerByInstitutionForm.patchValue({
          //   SecretCode: this.validSecretKey,
          //   PhoneNumber: this.validPhoneNumber,
          //   UserStatusID: (this.keyType == 'P') ? 1 : 2
          // })
          this.activeModal = 2;
          this.activeForm = 2;
        }
        else {
          // this.isValidKey = true;
          // this.verifykeyError = response.m_Item2;
        }
      }, err => {
        // this.isValidKey = true;
        // this.verifykeyError = "Oops! There has been an error from server. Please try again.";
      })
    }
  }

  restrictSpace(e) {
    if (e.which === 32)
      e.preventDefault();
  }

}
