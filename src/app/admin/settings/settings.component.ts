import { Component, HostListener, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from "../../utility/base-component/base.component";
import { ToastsManager } from "ng2-toastr";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CommonRegexp } from "../../utility/constants/validations";
import { CommonFunctions } from "../../utility/common-functions";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { UserAuthService } from "../../user-auth/user-auth.service";
import { SharedService } from "../../utility/shared-service/shared.service";
import { User } from "../../utility/shared-model/shared-user.model";
import { API } from "../../utility/constants/api";
import { style, transition, animate, trigger } from "@angular/animations";
import { slideUp } from "../animation";
import { TranslateService } from "../../utility/translate/translate.service";
import { CommonService } from "../../utility/shared-service/common.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [CommonService],
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
    slideUp
  ]
})
export class SettingsComponent extends BaseComponent implements OnInit {
  isShowModal: number = 1;
  commonFunctions = new CommonFunctions();
  changePasswordForm: FormGroup;
  userProfileForm: FormGroup;
  addressForm: FormGroup;
  frmBankAccount: FormGroup;
  frmNomineeDetails: FormGroup;

  status: string;
  UserDetails: any;
  user: User;
  checked: boolean;
  userDetails: any;
  userAddress: any;
  userNomineeDetails: any;
  AccountTypes: any[];
  NomineeRelations: any[];
  BankNames: any[];
  UserBankDetails: any[];
  defaultBankID: string;
  userID: number;
  isBankGrid: boolean = false;
  isBankAccountLink: boolean = false;
  isVisible_OtherRelations: boolean = false;

  constructor(public fb: FormBuilder,
    private translateService: TranslateService,
    private commonService: CommonService,
    public vcr: ViewContainerRef,
    private toastManager: ToastsManager,
    private apiManager: APIManager,
    private userAuthService: UserAuthService,
    private sharedService: SharedService) {
    super(toastManager, vcr);
  }

  ngOnInit() {
    this.UserDetails = this.sharedService.getUser();
    this.userID = this.UserDetails.UserID;
    this.createUserProfileForm();
    this.createChangePassword();
    this.createAddressForm();
    this.createBankAccountForm();
    this.createNomineeDetailsForm();
    this.GetUserBankDetails();
  }

  createChangePassword() {
    this.changePasswordForm = this.fb.group({
      OldPassword: new FormControl(''),
      Password: new FormControl('', Validators.compose([Validators.minLength(8), Validators.maxLength(50), Validators.pattern(CommonRegexp.PASSWORD_REGEXP)])),
      ConfirmPassword: new FormControl('', Validators.compose([Validators.minLength(8), Validators.maxLength(50), Validators.pattern(CommonRegexp.PASSWORD_REGEXP)])),
    }, { validator: this.validPassword });
  }

  validPassword(fg: FormGroup) {
    let newPasswordValue = fg.value["Password"]
    let confirmPasswordValue = fg.value["ConfirmPassword"]
    let valid = true;
    if (newPasswordValue != "" && (newPasswordValue !== confirmPasswordValue)) {
      valid = false;
    }
    return valid ? null : { 'repeatPassword': true };
  }

  createUserProfileForm() {
    this.userProfileForm = this.fb.group({
      Id: new FormControl(''),
      UserID: new FormControl(''),
      UserName: new FormControl(''),
      DcID: new FormControl(''),
      FirstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
      LastName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50),<any>Validators.pattern(CommonRegexp.ALPHABETS_REGEXP)])),
      PhoneNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), <any>Validators.pattern(CommonRegexp.NUMERIC_REGEXP)]),
      Email: new FormControl('', Validators.compose([Validators.minLength(5), Validators.maxLength(100), <any>Validators.pattern(CommonRegexp.EMAIL_ADDRESS_REGEXP)])),
      FatherName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])),
      AadharNumber: new FormControl('', Validators.compose([Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])),
    })
  }

  createAddressForm() {
    this.addressForm = this.fb.group({
      Id: new FormControl(''),
      Address1: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(250)])),
      Address2: new FormControl('', Validators.compose([Validators.minLength(4), Validators.maxLength(250)])),
      City: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50), <any>Validators.pattern(CommonRegexp.ALPHABETS_SPECIALCHAR_REGEXP)]),
      State: new FormControl('', Validators.compose([Validators.minLength(2), Validators.maxLength(50), <any>Validators.pattern(CommonRegexp.ALPHABETS_SPECIALCHAR_REGEXP)])),
      Zipcode: new FormControl('', Validators.compose([Validators.minLength(6), Validators.maxLength(6), Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])),
      Country: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern(CommonRegexp.ALPHA_NUMERIC)])),
    })
  }

  createBankAccountForm() {
    this.frmBankAccount = this.fb.group({
      ID: new FormControl(''),
      UserID: new FormControl(''),
      BankID: new FormControl(''),
      AccountHolderName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
      AccountNumber: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50), <any>Validators.pattern(CommonRegexp.ALPHA_NUMERIC)])),
      ConfirmAccountNumber: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(50), <any>Validators.pattern(CommonRegexp.ALPHA_NUMERIC)]),
      IFSCCode: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(50), <any>Validators.pattern(CommonRegexp.ALPHA_NUMERIC)])),
      BranchName: new FormControl('', Validators.compose([Validators.minLength(2), Validators.maxLength(50)])),
      BranchAddress: new FormControl('', Validators.compose([Validators.minLength(2), Validators.maxLength(250)])),
    }, { validator: this.validBankAccountNumber });
  }

  validBankAccountNumber(fg: FormGroup) {
    let accountNumber = fg.value["AccountNumber"]
    let confirmaccountNumber = fg.value["ConfirmAccountNumber"]
    let valid = true;
    if (accountNumber != "" && (accountNumber !== confirmaccountNumber)) {
      valid = false;
    }
    return valid ? null : { 'repeatAccountNumber': true };
  }

  createNomineeDetailsForm() {
    this.frmNomineeDetails = this.fb.group({
      UserID: new FormControl(''),
      NomineeID: new FormControl(null),
      NomineeName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
      NomineeRelationshipID: new FormControl('', Validators.compose([Validators.required])),
      OtherRelationship: new FormControl(null),
      NomineeAddress: new FormControl('', [Validators.minLength(2), Validators.maxLength(500)]),
      PhoneNumber: new FormControl('', Validators.compose([Validators.minLength(10), Validators.maxLength(10), <any>Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])),
    });
  }

  public GetUserProfile() {
    this.userAuthService._getUserProfile().then((res: any) => {
      if (res.m_Item1) {
        this.userDetails = res.m_Item3;
        this.sharedService.setUser(this.userDetails);
      }
      else {
        this.toastr.error(res.m_Item2);
      }
    }, err => {
      console.log(err);
    })
  }

  public GetUserAddress() {
    this.userAuthService._getUserAddress().then((res: any) => {
      if (res.m_Item1) {
        this.userAddress = res.m_Item3;
      }
      else {
        this.toastr.error(res.m_Item2);
      }
    }, err => {
      console.log(err);
    })
  }

  public GetBanks() {
    this.userAuthService._getBankNames().then((res: any) => {
      if (res.m_Item1) {
        this.BankNames = res.m_Item3;
      }
      else {
        this.toastr.error(res.m_Item2);
      }
    }, err => {
      console.log(err);
    })
  }

  public UpdateUserProfile(formUserProfile, IsValidForm) {
    if (IsValidForm) {
      this.apiManager.postAPI(API.UPDATEUSERPROFILE, formUserProfile).subscribe(response => {
        if (response.m_Item1) {
          this.sharedService.setUser(response.m_Item3);
          this.toastr.success(response.m_Item2);
          this.ngOnInit();
        }
        else {
          this.toastr.error(response.m_Item2);
          this.sharedService.setUser(this.UserDetails);
        }
        this.isShowModal = 1;
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Opps! Error while updating user profile. Please try again.");
      })
    }
    else {
      this.toastr.error("Invalid form data.");
    }
  }

  AddOrModifyAddress(formAddress, IsValidForm) {
    if (IsValidForm) {
      this.apiManager.postAPI(API.UPDATEUSERADDRESS, formAddress).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
        }
        else {
          this.toastr.error(response.m_Item2);
        }
        this.isShowModal = 1;
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Opps! Error while updating user address. Please try again.");
      })
    }
    else {
      this.toastr.error("Invalid form data.");
    }
  }

  AddOrModifyNomineeDetails(formNomineeDetails, IsValidForm) {
    if (IsValidForm) {
      formNomineeDetails.UserID = this.userID;
      this.apiManager.postAPI(API.ADDorMODIFYNOMINEE, formNomineeDetails).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
        }
        else {
          this.toastr.error(response.m_Item2);
        }
        this.isShowModal = 1;
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Opps! Error while add/updating nominee details. Please try again.");
      })
    }
    else {
      this.toastr.error("Invalid form data.");
    }
  }

  AddBankAccountDetails(formBankAccount, IsValidForm) {
    if (IsValidForm) {
      formBankAccount.UserID = this.userID;
      this.apiManager.postAPI(API.INSERTORUPDATEBANKDETAILS, formBankAccount).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          this.isBankGrid = true;
          this.isBankAccountLink = false;
          this.GetUserBankDetails();
        }
        else {
          this.toastr.error(response.m_Item2);
          this.isBankAccountLink = true;
          this.isBankGrid = false;
        }
        this.isShowModal = 1;
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Opps! Error while adding user bank account. Please try again.");
      })
    }
    else {
      this.toastr.error("Invalid form data.");
    }
  }

  onShowUserProfileModal() {
    this.createUserProfileForm();
    this.userProfileForm.patchValue(this.UserDetails);
    this.isShowModal = 2;
  }

  onShowPasswordModel() {
    this.createChangePassword();
    this.isShowModal = 3;
  }

  onShowAddOrModifyAddressModel() {
    this.isShowModal = 4;
    this.createAddressForm();
    this.userAuthService._getUserAddress().then((res: any) => {
      if (res.m_Item1) {
        this.userAddress = res.m_Item3;
        this.addressForm.patchValue(this.userAddress);
      }
      else {
        this.isShowModal = 1;
        this.toastr.error(res.m_Item2);
      }
    }, err => {
      console.log(err);
    })

  }

  onShowBankAccountModel() {
    this.isShowModal = 5;
    this.GetBanks();
    this.createBankAccountForm();
    // this.defaultBankID = "--Select Bank--"
    // this.frmNomineeDetails.controls['BankID'].setValue(this.defaultBankID, { onlySelf: true });
  }

  onShowAddNomineeModel() {
    this.isShowModal = 6;
    this.GetNomineeRelations();
    this.createNomineeDetailsForm();

    this.userAuthService._getUserNomineeDetails(this.userID).then((res: any) => {
      if (res.m_Item1) {
        this.userNomineeDetails = res.m_Item3;
        this.frmNomineeDetails.patchValue(this.userNomineeDetails);
        let nomineeRelationshipID = this.userNomineeDetails.NomineeRelationshipID;
        this.frmNomineeDetails.controls['NomineeRelationshipID'].setValue(nomineeRelationshipID, { onlySelf: true });
      }
      else {
        this.frmNomineeDetails.controls['NomineeRelationshipID'].setValue(1, { onlySelf: true });
        this.isVisible_OtherRelations = false;
      }
    }, err => {
      console.log(err);
    })
  }

  changePassword(formChangePassword, IsValidForm) {
    if (IsValidForm) {
      this.apiManager.postAPI(API.CHANGEPASSWORD, formChangePassword).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          //this.sharedService.logout();
        }
        else {
          this.toastr.error(response.m_Item2);
        }
        this.isShowModal = 1;
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Opps! Error while change password. Please try again.");
      })
    }
    else {
      this.toastr.error("Invalid form data.");
    }
  }

  public GetNomineeRelations() {
    this.commonService._getNomineeRelations().subscribe((res: any) => {
      if (res.m_Item1) {
        this.NomineeRelations = res.m_Item3.map(o => {
          return { NomineeRelationshipID: o.NomineeRelationshipID, NomineeRelations: o.NomineeRelations };
        });
      }
    }, err => {
      console.log(err);
    })
  }

  public GetAccountTypes() {
    this.commonService._getAccountTypes().subscribe((res: any) => {
      if (res.m_Item1) {
        this.AccountTypes = res.m_Item3.map(o => {
          return { AccountTypeID: o.AccountTypeID, AccountTypeName: o.AccountTypeName };
        });
      }
    }, err => {
      console.log(err);
    })
  }

  public GetUserBankDetails() {
    this.commonService._getUserBankDetails(this.userID).then((res: any) => {
      if (res.m_Item1) {
        this.isBankGrid = true;
        this.isBankAccountLink = false;
        this.UserBankDetails = res.m_Item3;
      }
      else {
        this.isBankAccountLink = true;
        this.isBankGrid = false;
      }
    }, err => {
      console.log(err);
    })
  }

  onChangeRelationship(RelationshipID: number) {
    if (RelationshipID == 13) {
      this.isVisible_OtherRelations = true;
      this.frmNomineeDetails.controls['OtherRelationship'].setValidators(Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20), <any>Validators.pattern(CommonRegexp.ALPHA_NUMERIC)]));
      this.frmNomineeDetails.get('OtherRelationship').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
    else {
      this.isVisible_OtherRelations = false;
      this.frmNomineeDetails.controls['OtherRelationship'].setValidators(null);
      this.frmNomineeDetails.controls['OtherRelationship'].setValue('');
      this.frmNomineeDetails.get('OtherRelationship').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
  }

  closeForm() {
    this.isShowModal = 1;
  }

  trackEvent() {
    this.sharedService.trackMixPanelEvent("Focus on Email");
  }

  //Esc event
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    let x = event.keyCode;
    if (x === 27) {
      this.isShowModal = 1;
    }
  }
}
