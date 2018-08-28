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
  selector: 'app-generatemysecretkeys',
  templateUrl: './generatemysecretkeys.component.html',
  styleUrls: ['./generatemysecretkeys.component.css'],
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

export class GeneratemysecretkeysComponent extends BaseComponent implements OnInit {
  @ViewChild('txtAmount') txtAmount: ElementRef;
  multipleSecretkeyForm: FormGroup;
  listRegKeys: any;
  gridTitle: string;
  MasterChargesDetails: any;
  WalletDetails: any;
  TotalAmount: any;
  RegistrationCharges: number = 0;
  KeyType: any;
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
    this.createMultipleSecretkeyForm();
    this.onChangeUsernameByDCIDorName(this.UserDetails.UserName);
  }

  createMultipleSecretkeyForm() {
    this.multipleSecretkeyForm = this.fb.group({
      UserID: [''],
      UserName: ['', Validators.compose([Validators.required])],
      WalletBalance: [''],
      KeyType: 'P',
      NoOfKeys: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])],
      IsWallet: true
    })
  }

  generateMultipleSecretKey(formParam, isValid) {
    if (isValid) {
      formParam.UserID = this.userID;
      this.apiManager.postAPI(API.GENERATEMULTIPLESECRETKEYS, formParam).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          this.multipleSecretkeyForm.patchValue({
            NoOfKeys: ''
          })
          this.txtAmount.nativeElement.value = '';
          this.onChangeUsernameByDCIDorName(this.UserDetails.UserName);
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
          this.MasterChargesDetails = response.m_Item3.MasterCharges;
          this.WalletDetails = response.m_Item3.Wallet;
          this.RegistrationCharges = this.MasterChargesDetails.RegistrationCharges;
          this.multipleSecretkeyForm.patchValue({
            UserName: this.UserDetails.UserName,
            WalletBalance: this.WalletDetails.Balance
          })
        }
        else {
          this.multipleSecretkeyForm.patchValue({
            UserName: ''
          })
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.toastr.error("Oops! There has been an error from server. Please try again.");
      })
    }
    else {
      this.MasterChargesDetails = [];
      this.WalletDetails = [];
      this.multipleSecretkeyForm.patchValue({
        UserName: ''
      })
    }
  }

  onChangeNoOfKeys(noOfKeys: number) {
    if (noOfKeys > 0 && this.RegistrationCharges > 0) {
      this.TotalAmount = noOfKeys * this.RegistrationCharges;
      if (!!this.WalletDetails && !!this.TotalAmount) {
        if (this.WalletDetails.Balance < this.TotalAmount) {
          this.toastr.error("Wallet Balance is insufficient");
          this.multipleSecretkeyForm.patchValue({
            NoOfKeys: ''
          })
          this.TotalAmount = '';
        }
      }
    }
    else {
      this.multipleSecretkeyForm.patchValue({
        NoOfKeys: ''
      })
      this.TotalAmount = '';
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
