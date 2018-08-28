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
import { SecretKeyService } from "../../utility/shared-service/secretkey.service";

@Component({
  selector: 'app-requestfunds',
  templateUrl: './requestfunds.component.html',
  styleUrls: ['./requestfunds.component.css'],
  providers: [SecretKeyService],
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

export class RequestfundsComponent extends BaseComponent implements OnInit {

  @ViewChild('txtAmount') txtAmount: ElementRef;
  requestFundsForm: FormGroup;
  listRegKeys: any;
  gridTitle: string;
  userID: number;
  UserDetails: any;

  constructor(private sharedService: SharedService,
    private secretKeyService: SecretKeyService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.UserDetails = this.sharedService.getUser();
    this.userID = this.UserDetails.UserID;
    this.createrequestFundsForm();
    this.requestFundsForm.patchValue({
      UserName: this.UserDetails.UserName,
    })
  }

  createrequestFundsForm() {
    this.requestFundsForm = this.fb.group({
      UserID: [''],
      UserName: [''],
      RequestTo: ['', Validators.compose([Validators.required])],
      RequestAmount: new FormControl('', Validators.compose([Validators.min(1), Validators.maxLength(8), <any>Validators.pattern(CommonRegexp.NUMERIC_REGEXP)]))
    })
  }

  requestFunds(formParam, isValid) {
    if (isValid) {
      formParam.UserID = this.userID;
      this.apiManager.postAPI(API.REQUESTFUNDS, formParam).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
        }
        else
          this.toastr.error(response.m_Item2);
      }, err => {
        this.toastr.error("Error while generate multiple register keys. Please try again.");
      });
    }
  }

  onChangeUsernameByDCIDorName(DcIDorName: any) {
    if (DcIDorName != "") {
      this.secretKeyService._getUserWalletMasterCharges(DcIDorName).subscribe(response => {
        if (response.m_Item1) {
          this.requestFundsForm.patchValue({
            UserName: this.UserDetails.UserName,
          })
        }
        else {
          this.requestFundsForm.patchValue({
            UserName: ''
          })
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.toastr.error("Oops! There has been an error from server. Please try again.");
      })
    }
    else {
      this.requestFundsForm.patchValue({
        UserName: ''
      })
    }
  }

  getFormattedDate(date1) {
    var date = new Date(date1);
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return day + '-' + month + '-' + year;
  }

}
