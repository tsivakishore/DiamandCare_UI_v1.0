import { Component, HostListener, OnInit, ViewContainerRef } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { CommonRegexp } from "../../utility/constants/validations";
import { BaseComponent } from "../../utility/base-component/base.component";
import { RouteConstants } from "../../utility/constants/routes";
import { UserAuthService } from "../user-auth.service";
import { SharedService } from "../../utility/shared-service/shared.service";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { API } from "../../utility/constants/api";
declare var particlesJS: any;
import { CommonFunctions } from "../../utility/common-functions";
import { animate, style, transition, trigger } from "@angular/animations";
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { BaseUrl } from "../../utility/constants/base-constants";
import { CommonService } from "../../utility/shared-service/common.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
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
export class LoginComponent extends BaseComponent implements OnInit {
  loginForm: FormGroup;
  frmForgetPassword: FormGroup;
  userDetails: any;

  loginError: string;
  isValidLogin: boolean = false;

  isShowModal: number = 1;
  activeForm: number = 1;
  userId: string;
  userEmail: string;
  userName: string;
  commonFunctions = new CommonFunctions();

  constructor(public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    private userAuthService: UserAuthService,
    private commonService: CommonService,
    private sharedService: SharedService,
    private router: Router,
    private apiManager: APIManager,
    private formBuilder: FormBuilder,
    private http: Http) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.sharedService.trackMixPanelEvent("visit login");
    sessionStorage.clear();
    this.sharedService.setToken(null);
    this.sharedService.setUser(null);
    this.sharedService.setUserName("");
    this.sharedService.setUserID("");
    this.sharedService.setRoleID("");
    this.createLoginForm();
    this.createForgetPasswordForm();
    particlesJS.load('login-particles-js', 'assets/js/particles.json', function () { });
  }

  // Initialize form elements with validations and Methods
  createLoginForm() {
    this.loginForm = this.formBuilder.group({
      UserName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(25)])),
      Password: new FormControl('')
    });
  }

  createForgetPasswordForm() {
    this.frmForgetPassword = this.formBuilder.group({
      UserName: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  // Login form submit method
  onLogin(formParams, isValidForm) {
    if (isValidForm) {
      this.sharedService.setPass(formParams.password);
      this.sharedService.setUserName(formParams.UserName);
      let grantdata = "grant_type=password&scope=read%20write&client_secret=GLt2hoCYSzuR6TqTEed1Z0MgJ9JVhLPCNfgREarlzgg=&client_id=JavaScript&username=" + formParams.UserName + "&password=" + formParams.Password;
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      headers.append('Accept', 'application/json');
      let options = new RequestOptions({ headers: headers });
      this.sharedService.setLoader(true);
      return this.http.post(BaseUrl.LoginApi + 'token', grantdata, { headers: headers })
        .toPromise()
        .then(this.extractData.bind(this))
        .catch(error => {
          if (!error.ok && error.status == 0) {
            this.isValidLogin = true;
            this.loginError = "There has been an error from server. Please try again.";
          }
          else if (!error.ok && error.status == 400) {
            this.isValidLogin = true;
            this.loginError = "The user name or password is incorrect.";
          }
          this.sharedService.setLoader(false);
        });
    }
  }

  public getUserDetaildByLoginID() {
    this.userAuthService._getUserProfile().then((res: any) => {
      if (res.m_Item1) {
        this.userDetails = res.m_Item3;
        this.sharedService.setUser(this.userDetails);
      }
    }, err => {
      console.log(err);
    })
  }

  forgetPassword(formForgetPassword) {
    this.apiManager.postAPI(API.FORGETPASSWORD, formForgetPassword).subscribe(response => {
      if (response.m_Item1) {
        this.toastr.success(response.m_Item2);
      }
      else {
        this.toastr.error(response.m_Item2);
      }
      this.isShowModal = 1;
    }, err => {
      this.isShowModal = 1;
      this.toastr.error("Opps! Error while getting password. Please try again.");
    })
  }

  private extractData(res: Response) {
    let body = res.json();

    this.sharedService.setToken(body.access_token);
    this.sharedService.setUserID(body.userId);
    this.sharedService.setRoleID(body.roleId);
    this.sharedService.setRoleName(body.roleName);
    this.getUserDetaildByLoginID();
    this.sharedService.setLoader(false);
    if (body.roleId === BaseUrl.AdminRoleID) {
      this.router.navigate(["/" + RouteConstants.APPLIEDLOANDETAILS]);
    }
    if (body.roleId === BaseUrl.UserRoleID) {
      this.router.navigate(["/" + RouteConstants.EARNLOANS]);
    }

    return body || {};
  }

  viewRegisterForm() {
    this.router.navigate(["/" + RouteConstants.REGISTERATION]);
  }

  viewForgetPAsswordForm() {
    this.createForgetPasswordForm();
    this.isShowModal = 2;
  }

  closeForm() {
    this.isShowModal = 1;
  }

}
