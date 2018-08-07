import { Component, HostListener, OnInit, ViewContainerRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { CommonRegexp, CommonValidationMessages } from "../../utility/constants/validations";
import { BaseComponent } from "../../utility/base-component/base.component";
import { RouteConstants } from "../../utility/constants/routes";
import { UserAuthService } from "../user-auth.service";
import { SharedService } from "../../utility/shared-service/shared.service";
import { Status, BaseUrl } from "../../utility/constants/base-constants";
import { TranslateService } from "../../utility/translate/translate.service";
import { style, transition, animate, trigger } from "@angular/animations";
declare var particlesJS: any;
declare var $: any;
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { API } from "../../utility/constants/api";
import { CommonFunctions } from "../../utility/common-functions";
import { User } from "../../utility/shared-model/shared-user.model";
import { CommonService } from "../../utility/shared-service/common.service";

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
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
    ])
  ]
})
export class RegisterComponent extends BaseComponent implements OnInit {
  registerForm: FormGroup;
  secretKeyForm: FormGroup;

  registerFormValues: any;
  commonFunctions = new CommonFunctions();
  activeForm: number = 1;
  activeModal: number = 1;
  email: string;
  user: User;
  mixpanel: any;
  sendInfoNote: any;
  schoolCodeValue: string = '91';
  underIDValue: string;
  verifykeyError: string;
  isValidKey: boolean = false;
  validSecretKey: string;
  keyType: string;
  validPhoneNumber: string;
  sponserDetails: any;
  underDetails: any[];
  defaultUndeID: string;
  schoolDetails: any[];
  sourceOfUser: any[];
  defaultSourceID: number;
  sponserID: number;

  constructor(public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    private commonService: CommonService,
    private userAuthService: UserAuthService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private apiManager: APIManager,
    private formBuilder: FormBuilder,
    public translateService: TranslateService, ) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.sharedService.trackMixPanelEvent("visit registration");
    this.email = this.route.snapshot.queryParams["email"];
    this.defaultSourceID = 1;
    this.createSecretKeyForm();
    this.createRegisterForm();
    particlesJS.load('register-particles-js', 'assets/js/particles.json', function () {
    });
  }

  // Initialize form elements with validations and Methods
  createRegisterForm() {
    let refer = this.sharedService.getRefer();
    this.registerForm = this.formBuilder.group({
      FirstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
      LastName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])),
      //UserName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(25), <any>Validators.pattern(CommonRegexp.USERNAME_REGEXP)])),
      UserName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(25)])),
      Email: new FormControl(this.email ? this.email : '', Validators.compose([Validators.minLength(5), Validators.maxLength(100), <any>Validators.pattern(CommonRegexp.EMAIL_ADDRESS_REGEXP)])),
      Password: new FormControl('', Validators.compose([Validators.minLength(8), Validators.maxLength(50), Validators.pattern(CommonRegexp.PASSWORD_REGEXP)])),
      ConfirmPassword: new FormControl(''),
      PhoneNumber: new FormControl(''),
      FatherName: new FormControl(''),
      AadharNumber: new FormControl('', Validators.compose([Validators.minLength(12), Validators.maxLength(12), Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])),
      SponserID: new FormControl(''),
      // SchoolID: new FormControl(''),
      SourceID: new FormControl(''),
      SponserName: new FormControl(''),
      UnderID: new FormControl(''),
      UnderName: new FormControl(''),
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

  // Register form submit method
  onRegister(formParam, isValidForm) {
    this.sharedService.setLoader(true);
    if (isValidForm) {
      this.sharedService.trackMixPanelEvent("registration");
      this.registerFormValues = formParam;
      this.sharedService.setPass(this.registerFormValues.Password);
      this.sharedService.setUserName(this.registerFormValues.UserName);
      this.registerFormValues.EncryptPassword = '';
      this.registerFormValues.ConfirmPassword = '';
      this.registerFormValues.SponserID = this.sponserID;
      this.registerFormValues.RoleID = BaseUrl.UserRoleID;
      this.sharedService.trackMixPanelEvent("actual sign up");
      this.apiManager.postAPI(API.SIGNUP, this.registerFormValues).subscribe(response => {
        if (response.m_Item1) {
          this.sharedService.setLoader(false);
          this.toastr.success(this.translateService.instant('registerSuccessStatus'));
          this.sendInfoNote = response.m_Item2;
          this.registerForm.reset();
          this.viewLoginForm();
        }
        else {
          this.sharedService.setLoader(false);
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.sharedService.setLoader(false);
        this.toastr.error(this.translateService.instant('registerFailedStatus'));
        this.activeForm = 1;
        this.activeModal = 1;
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
          this.createRegisterForm();
          this.GetSourceOfUser();
          this.registerForm.controls['SourceID'].setValue(this.defaultSourceID, { onlySelf: true });
          this.defaultUndeID = "--Select UnderID--"
          this.registerForm.controls['UnderID'].setValue(this.defaultUndeID, { onlySelf: true });
          this.registerForm.patchValue({
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

  public GetSchoolDetails() {
    this.commonService._getSchoolDetails().subscribe((res: any) => {
      if (res.m_Item1) {
        this.schoolDetails = res.m_Item3.map(o => {
          return { SchoolID: o.SchoolID, SchoolName: o.SchoolName };
        });
      }
    }, err => {
      console.log(err);
    })
  }

  public GetSourceOfUser() {
    this.commonService._getSourceOfUser().subscribe((res: any) => {
      if (res.m_Item1) {
        this.sourceOfUser = res.m_Item3.map(o => {
          return { SourceID: o.SourceID, SourceName: o.SourceName };
        });
      }
    }, err => {
      console.log(err);
    })
  }

  viewLoginForm() {
    this.router.navigate(["/" + RouteConstants.LOGIN]);
  }

  closeModal() {
    this.activeForm = 1;
    this.createRegisterForm();
  }

  isOpenModal(val, type) {
    var body = [val, type]
    this.sharedService.setTokenTermModal(body);
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

  onChangeSponserId(SponserID) {
    if (SponserID != "") {
      this.apiManager.postAPI(API.SPONSERDETAILS, { DcID: SponserID }).subscribe(response => {
        if (response.m_Item1) {
          this.sponserDetails = response.m_Item3.SponserDetails;
          this.underDetails = response.m_Item3.lstUnderDetails;
          if (this.sponserDetails != null && this.underDetails.length > 0) {
            this.registerForm.controls['UnderID'].setValue(response.m_Item3.lstUnderDetails[0].UnderID, { onlySelf: true });
            this.registerForm.patchValue({
              SponserName: this.sponserDetails.SponserName,
              //UnderID: response.Item3.lstUnderDetails[0].UnderID,
              UnderName: response.m_Item3.lstUnderDetails[0].UserName,
            })
            this.sponserID = this.sponserDetails.SponserID;
          }
          else {
            this.registerForm.patchValue({
              SponserID: ""
            })
            this.toastr.error(response.m_Item2);
          }
        }
        else {
          this.registerForm.patchValue({
            SponserID: ""
          })
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.registerForm.value.SponserID = "";
        this.toastr.error("Oops! There has been an error from server. Please try again.");
      })
    }
  }

  onSchoolChange(countryCode) {
    this.schoolCodeValue = countryCode;
  }

  onUnderIDChange(underId) {
    let underDetails = this.underDetails.find(element => element.UnderID == underId);
    this.registerForm.patchValue({
      UnderName: underDetails.UserName
    })
  }
}
