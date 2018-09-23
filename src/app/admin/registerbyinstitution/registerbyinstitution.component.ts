import { Component, HostListener, OnInit, ViewContainerRef } from "@angular/core";
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

@Component({
  selector: 'app-registerbyinstitution',
  templateUrl: './registerbyinstitution.component.html',
  styleUrls: ['./registerbyinstitution.component.css'],
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

export class RegisterbyinstitutionComponent extends BaseComponent implements OnInit {

  registerByInstitutionForm: FormGroup;
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
    this.sharedService.trackMixPanelEvent("visit registration");
    this.email = this.route.snapshot.queryParams["email"];
    this.UserDetails = this.sharedService.getUser();
    this.defaultSourceID = 1;
    this.createSecretKeyForm();
    this.createRegisterForm();
  }

  // Initialize form elements with validations and Methods
  createRegisterForm() {
    let refer = this.sharedService.getRefer();
    this.registerByInstitutionForm = this.formBuilder.group({
      UserID: [0],
      FirstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
      LastName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])),
      UserName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(25)])),
      Email: new FormControl(this.email ? this.email : '', Validators.compose([Validators.minLength(5), Validators.maxLength(100), <any>Validators.pattern(CommonRegexp.EMAIL_ADDRESS_REGEXP)])),
      Password: new FormControl('', Validators.compose([Validators.minLength(8), Validators.maxLength(50), Validators.pattern(CommonRegexp.PASSWORD_REGEXP)])),
      ConfirmPassword: new FormControl(''),
      PhoneNumber: new FormControl(''),
      FatherName: new FormControl(''),
      AadharNumber: new FormControl('', Validators.compose([Validators.minLength(12), Validators.maxLength(12), Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])),
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
    if (isValidForm) {
      this.registerFormValues = formParam;
      this.registerFormValues.UserID = this.UserDetails.UserID;
      this.sharedService.setPass(this.registerFormValues.Password);
      this.sharedService.setUserName(this.registerFormValues.UserName);
      this.registerFormValues.EncryptPassword = '';
      this.registerFormValues.ConfirmPassword = '';
      this.registerFormValues.RoleID = BaseUrl.UserRoleID;
      this.apiManager.postAPI(API.REGISTERUSERSBYINSTITUTION, this.registerFormValues).subscribe(response => {
        if (response.m_Item1) {
          this.registerByInstitutionForm.reset();
          this.viewUsersByInstitutionForm();
        }
        else {
          this.toastr.error(response.m_Item2);
        }
      }, err => {
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
          this.registerByInstitutionForm.patchValue({
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

  onSchoolChange(countryCode) {
    this.schoolCodeValue = countryCode;
  }

}
