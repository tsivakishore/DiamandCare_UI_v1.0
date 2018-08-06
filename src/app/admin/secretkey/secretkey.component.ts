import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SharedService } from "../../utility/shared-service/shared.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { BaseComponent } from "../../utility/base-component/base.component";
import { CommonRegexp } from "../../utility/constants/validations";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { API } from "../../utility/constants/api";
import { dialog, slideUp } from "../animation";
import { TranslateService } from "../../utility/translate/translate.service";
import * as moment from 'moment';
import { Message } from "primeng/primeng";
import { style, transition, animate, trigger } from "@angular/animations";
import { SecretKeyService } from "../../utility/shared-service/secretkey.service";

@Component({
  selector: 'app-secretkey',
  templateUrl: './secretkey.component.html',
  styleUrls: ['./secretkey.component.css'],
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
    slideUp
  ]
})
export class SecretkeyComponent extends BaseComponent implements OnInit {

  secretkeyForm: FormGroup;
  multipleSecretkeyForm: FormGroup;
  isAddressValid: boolean = true;
  listRegKeys: any;
  gridTitle: string;
  selectedRow: any;
  FranchiseDetails: any;
  MasterChargesDetails: any;
  WalletDetails: any;
  defaultKeyType: any;
  TotalAmount: any;
  RegistrationCharges: number = 0;
  KeyType: any;
  isChecked: boolean = false;
  isNoOfKeysDisabled: boolean = false;
  userID: number;

  public IsSingleChecked: boolean = true;
  public IsMultipleChecked: boolean = false;
  public is_Visible_Single: boolean = false;
  public is_Visible_Multiple: boolean = false;

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
    this.GetIssuedRegisterKeys();
    this.createsecretkeyForm();
    this.createMultipleSecretkeyForm();
    this.is_Visible_Single = true;
    this.defaultKeyType = 'P';
    this.KeyType = "P";
    this.isChecked = false;
    this.multipleSecretkeyForm.controls['KeyType'].setValue(this.defaultKeyType, { onlySelf: true });
  }

  createsecretkeyForm() {
    this.secretkeyForm = this.fb.group({
      PhoneNumber: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])],
    })
  }

  createMultipleSecretkeyForm() {
    this.multipleSecretkeyForm = this.fb.group({
      UserID: ['', Validators.compose([Validators.required])],
      UserName: ['', Validators.compose([Validators.required])],
      WalletBalance: [''],
      KeyType: [null],
      NoOfKeys: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])],
      IsWallet: []
    })
  }

  registerKeyGenearation(formParam, isValid) {
    if (isValid && this.isAddressValid) {
      this.apiManager.postAPI(API.SENDSECRETKEY, formParam).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          this.GetIssuedRegisterKeys();
        }
        else
          this.toastr.error(response.m_Item2);
      }, err => {
        this.toastr.error("Error while generate register key. Please try again.");
      });
    }
  }

  generateMultipleSecretKey(formParam, isValid) {
    if (isValid) {
      formParam.UserID = this.userID;
      this.apiManager.postAPI(API.GENERATEMULTIPLESECRETKEYS, formParam).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          this.GetIssuedRegisterKeys();
        }
        else
          this.toastr.error(response.m_Item2);
      }, err => {
        this.toastr.error("Error while generate multiple register keys. Please try again.");
      });
    }
  }

  onChangeUsernameByDCIDorName(DcIDorName: any) {
    DcIDorName = DcIDorName.UserID;
    if (DcIDorName != "") {
      this.secretKeyService._getUsernameWalletMasterChargesByDCIDorName(DcIDorName).subscribe(response => {
        if (response.m_Item1) {
          this.FranchiseDetails = response.m_Item3.Franchise;
          this.userID = this.FranchiseDetails.UserID
          this.MasterChargesDetails = response.m_Item3.MasterCharges;
          this.WalletDetails = response.m_Item3.Wallet;
          this.RegistrationCharges = this.MasterChargesDetails.RegistrationCharges;
          this.isNoOfKeysDisabled = false;
          this.multipleSecretkeyForm.patchValue({
            UserName: this.FranchiseDetails.UserName,
            WalletBalance: this.WalletDetails.Balance
          })
          console.log(this.FranchiseDetails)
          console.log(this.MasterChargesDetails)
          console.log(this.WalletDetails)
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
      this.FranchiseDetails = [];
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
      if (this.isChecked == true && !!this.WalletDetails && !!this.TotalAmount) {
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

  public GetIssuedRegisterKeys() {
    this.sharedService.setLoader(true);
    this.secretKeyService._getSecretKey().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listRegKeys = res.m_Item3;
        this.gridTitle = "Lisi of Secret Keys"
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  ResendSecretKey(rowIndex) {
    this.sharedService.setLoader(true);
    this.selectedRow = this.listRegKeys[rowIndex];
    this.apiManager.postAPI(API.RESENDSECRETKEY, this.selectedRow).subscribe(response => {
      if (response.m_Item1) {
        this.toastr.success(response.m_Item2);
      }
      else {
        this.toastr.error(response.m_Item2);
      }
    }, err => {
      console.log(err);
      this.toastr.error("Error while resend register key. Please try again.");
    });
  }

  onSelectionChange(isRadiobuttionClicked) {
    if (isRadiobuttionClicked == "InActive") {
      this.IsMultipleChecked = true;
      this.IsSingleChecked = false;
      this.is_Visible_Single = false;
      this.is_Visible_Multiple = true;
    }
    else {
      this.IsMultipleChecked = false;
      this.IsSingleChecked = true;
      this.is_Visible_Single = true;
      this.is_Visible_Multiple = false;
    }
  }

  onCheckedChange(isCheckboxClicked) {
    debugger;
    if (isCheckboxClicked == "on") {
      debugger;
      if (this.KeyType == "P" && !!this.WalletDetails && !!this.TotalAmount) {
        if (this.WalletDetails.Balance < this.TotalAmount) {
          this.toastr.error("Wallet Balance is insufficient");
          this.multipleSecretkeyForm.patchValue({
            NoOfKeys: ''
          })
          this.TotalAmount = '';
        }
      }
      else {
        this.isChecked = false;
        this.multipleSecretkeyForm.patchValue({
          IsWallet: false
        })
      }
    }
  }

  onChangeKeyType(keyType: any) {
    if (keyType == "F") {
      this.KeyType = "F"
      this.isChecked = false;
        this.multipleSecretkeyForm.patchValue({
          IsWallet: false
        })
      // this.multipleSecretkeyForm.controls['NoOfKeys'].setValidators(null);
      // this.multipleSecretkeyForm.get('NoOfKeys').updateValueAndValidity({ onlySelf: false, emitEvent: false });
    }
    else if (keyType == "P") {
      this.KeyType = "P"
      this.multipleSecretkeyForm.controls['NoOfKeys'].setValidators(Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_REGEXP)]));
      this.multipleSecretkeyForm.get('NoOfKeys').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
  }

  KeyTypes = [
    { KeyID: "F", KeyName: "Free" },
    { KeyID: "P", KeyName: "Paid" },
  ];

}
