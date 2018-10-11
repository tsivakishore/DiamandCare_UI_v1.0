import { Component, HostListener, OnInit, Input, ViewContainerRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { CommonRegexp, CommonValidationMessages } from "../../utility/constants/validations";
import { BaseComponent } from "../../utility/base-component/base.component";
import { RouteConstants } from "../../utility/constants/routes";
import { SharedService } from "../../utility/shared-service/shared.service";
import { Status, BaseUrl } from "../../utility/constants/base-constants";
import { TranslateService } from "../../utility/translate/translate.service";
import { style, transition, animate, trigger } from "@angular/animations";
declare var $: any;
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { API } from "../../utility/constants/api";
import { CommonFunctions } from "../../utility/common-functions";
import { User } from "../../utility/shared-model/shared-user.model";
import { CommonService } from "../../utility/shared-service/common.service";
import { dialog, slideUp } from "../animation";

@Component({
  selector: 'app-renewloanaccount',
  templateUrl: './renewloanaccount.component.html',
  styleUrls: ['./renewloanaccount.component.css'],
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
    slideUp, dialog
  ]
})

export class RenewloanaccountComponent extends BaseComponent implements OnInit {
  parentUserID: number;
  renewLoanAccountForm: FormGroup;
  secretKeyForm: FormGroup;
  renewFormValues: any;
  commonFunctions = new CommonFunctions();
  activeForm: number = 1;
  activeModal: number = 1;
  email: string;
  user: User;
  mixpanel: any;
  sendInfoNote: any;
  schoolCodeValue: string = '91';
  verifykeyError: string;
  isValidKey: boolean = false;
  validSecretKey: string;
  keyType: string;
  validPhoneNumber: string;
  sourceOfUser: any[];
  defaultSourceID: number;
  UserDetails: any;

  constructor(public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    private commonService: CommonService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private apiManager: APIManager,
    private formBuilder: FormBuilder,
    public translateService: TranslateService, ) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.FindAppliyUserID();
    this.sharedService.trackMixPanelEvent("visit registration");
    this.email = this.route.snapshot.queryParams["email"];
    this.UserDetails = this.sharedService.getUser();
    this.defaultSourceID = 1;
    this.createSecretKeyForm();
    this.createRenewLoanAccountForm();
  }

  FindAppliyUserID() {
    this.route.params.subscribe(translatedValue => {
      if ('UserID' in translatedValue) {
        this.parentUserID = parseInt(atob(translatedValue.UserID));
      }
    })
  }

  // Initialize form elements with validations and Methods
  createRenewLoanAccountForm() {
    this.renewLoanAccountForm = this.formBuilder.group({
      ParentID: this.parentUserID,
      FirstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
      LastName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])),
      UserName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(25)])),
      // Email: new FormControl(this.email ? this.email : '', Validators.compose([Validators.minLength(5), Validators.maxLength(100), <any>Validators.pattern(CommonRegexp.EMAIL_ADDRESS_REGEXP)])),
      Password: new FormControl('', Validators.compose([Validators.minLength(8), Validators.maxLength(50), Validators.pattern(CommonRegexp.PASSWORD_REGEXP)])),
      ConfirmPassword: new FormControl(''),
      PhoneNumber: new FormControl(''),
      // FatherName: new FormControl(''),
      // AadharNumber: new FormControl('', Validators.compose([Validators.minLength(12), Validators.maxLength(12), Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])),
      SecretCode: new FormControl(''),
      RoleID: new FormControl(''),
      EncryptPassword: [''],
      UserStatusID: 2
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

  // Renew Loan Account form submit method
  onRenewLoanAccount(formParam, isValidForm) {
    if (isValidForm) {
      this.renewFormValues = formParam;
      this.sharedService.setPass(this.renewFormValues.Password);
      this.sharedService.setUserName(this.renewFormValues.UserName);
      this.renewFormValues.EncryptPassword = '';
      this.renewFormValues.ConfirmPassword = '';
      this.renewFormValues.RoleID = BaseUrl.UserRoleID;
      this.apiManager.postAPI(API.RENEWLOANACCOUNT, this.renewFormValues).subscribe(response => {
        if (response.m_Item1) {
          this.renewLoanAccountForm.reset();
          this.toastr.success(response.m_Item2);
        }
        else {
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.toastr.error(this.translateService.instant('renewLoanAccountFailedStatus'));
        this.activeForm = 2;
        this.activeModal = 2;
      });
    }
  }

  // Initialize form elements with validations and Methods
  createSecretKeyForm() {
    this.secretKeyForm = this.formBuilder.group({
      RegKey: new FormControl('', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])),
      PhoneNumber: new FormControl(''),
      KeyType: ''
    });
  }

  // SecretKey form submit method
  onVerifySecretKey(formValue, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.VERIFY_SECRETKEY, formValue).subscribe(response => {
        if (response.m_Item1) {
          this.validSecretKey = formValue.RegKey;
          this.validPhoneNumber = formValue.PhoneNumber;
          this.keyType = response.m_Item3;
          this.createRenewLoanAccountForm();
          this.renewLoanAccountForm.patchValue({
            SecretCode: this.validSecretKey,
            PhoneNumber: this.validPhoneNumber,
            UserStatusID: (this.keyType == 'P') ? 1 : 2
          })
          this.activeModal = 2;
          this.activeForm = 2;
        }
        else {
          this.isValidKey = true;
          this.verifykeyError = response.m_Item2;
        }
      }, err => {
        this.isValidKey = true;
        this.verifykeyError = "Oops! There has been an error from server. Please try again.";
      })
    }
  }

  viewUsersByInstitutionForm() {
    this.router.navigate(["/" + RouteConstants.USERSBYINSTITUTION]);
  }

  closeModal() {
    this.activeForm = 1;
    this.createRenewLoanAccountForm();
  }

  //Esc event
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    let x = event.keyCode;
    if (x === 27) {
      this.activeForm = 1;
    }
  }

  trackEvent() {
    this.sharedService.trackMixPanelEvent("Focus on Email");
  }

}
