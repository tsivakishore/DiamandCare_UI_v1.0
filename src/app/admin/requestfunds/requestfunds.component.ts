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
import { WalletService } from '../../utility/shared-service/wallet.service';

@Component({
  selector: 'app-requestfunds',
  templateUrl: './requestfunds.component.html',
  styleUrls: ['./requestfunds.component.css'],
  providers: [UserService, WalletService],
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
  ToUserDetails: any;
  lstUserFundsRequestDetails: any;

  constructor(private sharedService: SharedService,
    private userService: UserService,
    private walletServ: WalletService,
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
    this.getUserFundRequestDetails();
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
      RequestToUserID: [''],
      RequestedAmount: ['', Validators.compose([Validators.required, Validators.min(1.00), Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      RequestStatusID: [''],
      RequestedName: ['']
    })
  }

  requestFunds(formParam, isValid) {
    if (isValid) {
      formParam.UserID = this.userID;
      this.apiManager.postAPI(API.REQUESTFUNDS, formParam).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          this.requestFundsForm.patchValue({
            RequestTo: '',
            RequestToUserID: '',
            RequestedAmount: '',
            RequestedName: ''
          })
          this.getUserFundRequestDetails();
        }
        else
          this.toastr.error(response.m_Item2);
      }, err => {
        this.toastr.error("Error while generate multiple register keys. Please try again.");
      });
    }
  }

  public onChangeUsernameByDCIDorName(DCIDorName) {
    this.sharedService.setLoader(true);
    if (DCIDorName != "") {
      this.userService._getUserDetailsByDCIDorName(DCIDorName).subscribe((res: any) => {
        this.sharedService.setLoader(false);
        if (res.m_Item1) {
          this.ToUserDetails = res.m_Item3;
          this.requestFundsForm.patchValue({
            RequestTo: this.ToUserDetails.UserName,
            RequestToUserID: this.ToUserDetails.UserID,
            RequestStatusID: 1,
            RequestedName: this.ToUserDetails.FirstName + ' ' + this.ToUserDetails.LastName
          })
        }
        else {
          this.requestFundsForm.patchValue({
            RequestTo: ''
          })
          this.toastr.error("Please provide valid user name or DCID");
        }
      }, err => {
        this.sharedService.setLoader(false);
      })
    }
    else {
      this.requestFundsForm.patchValue({
        RequestTo: ''
      })
    }
  }

  public getUserFundRequestDetails() {
    this.sharedService.setLoader(true);
    this.walletServ._getUserFundRequestDetails().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstUserFundsRequestDetails = res.m_Item3;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
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
