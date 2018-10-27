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
import { style, transition, animate, trigger } from "@angular/animations";
import { SecretKeyService } from "../../utility/shared-service/secretkey.service";
import { UserService } from "../../utility/shared-service/user.service";

@Component({
  selector: 'app-mysecretkeys',
  templateUrl: './mysecretkeys.component.html',
  styleUrls: ['./mysecretkeys.component.css'],
  providers: [SecretKeyService, UserService],
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
export class MysecretkeysComponent extends BaseComponent implements OnInit {

  isShowModal: number = 1;
  listRegKeys: any;
  listSharedRegKeys: any;
  gridTitle: string;
  selectedRow: any;
  phoneNumberForm: FormGroup;
  shareKeyForm: FormGroup;
  UserDetails: any;
  ToUserDetails: any;

  constructor(private sharedService: SharedService,
    private secretKeyService: SecretKeyService,
    private userService: UserService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.UserDetails = this.sharedService.getUser();
    this.GetIssuedRegisterKeys();
    this.GetSharedRegisterKeys();
    this.gridTitle = "List of My Secret Keys"
  }

  createPhoneNumberForm() {
    this.phoneNumberForm = this.fb.group({
      PhoneNumber: new FormControl('', Validators.compose([Validators.minLength(10), Validators.maxLength(10), <any>Validators.pattern(CommonRegexp.NUMERIC_REGEXP)]))
    })
  }

  createShareKeyForm() {
    this.shareKeyForm = this.fb.group({
      ToUserID: new FormControl(''), //Share from user id
      SharedFrom: new FormControl(''),
      RegKey: new FormControl(''),
      SharedTo: new FormControl('', Validators.compose([Validators.required])),
      SharedUserID: new FormControl(''),
      SharedToName: new FormControl(''),
      PhoneNumber: new FormControl('', Validators.compose([Validators.minLength(10), Validators.maxLength(10), <any>Validators.pattern(CommonRegexp.NUMERIC_REGEXP)]))
    })
  }

  public GetIssuedRegisterKeys() {
    this.sharedService.setLoader(true);
    this.secretKeyService._getSecretKeyByUserID().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listRegKeys = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  public GetSharedRegisterKeys() {
    this.sharedService.setLoader(true);
    this.secretKeyService._getSharedSecretKeyByUserID().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listSharedRegKeys = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  onShowPhoneNumberModal(rowIndex) {
    this.selectedRow = this.listRegKeys[rowIndex];
    this.createPhoneNumberForm();
    this.phoneNumberForm.patchValue({
      PhoneNumber: this.selectedRow.PhoneNumber
    })
    this.isShowModal = 2;
  }

  ResendSecretKey(phoneNumber, isValidForm) {
    if (isValidForm) {
      this.selectedRow.PhoneNumber = phoneNumber;
      this.apiManager.postAPI(API.RESENDSECRETKEY, this.selectedRow).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          this.isShowModal = 1;
        }
        else {
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Error while resend register key. Please try again.");
      });
    }
    else {
      this.toastr.error("Invalid form data.");
    }
  }

  OpenShareKeyPopup(rowIndex) {
    this.isShowModal = 3;
    this.selectedRow = this.listRegKeys[rowIndex];
    this.createShareKeyForm();
    this.shareKeyForm.patchValue({
      ToUserID: this.selectedRow.ToUserID,
      SharedFrom: this.selectedRow.CreatedBy,
      RegKey: this.selectedRow.RegKey,
    })
  }

  OnSubmitShareKey(formShareKey, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.SHARESECRETKEY, formShareKey).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          this.GetIssuedRegisterKeys();
          this.GetSharedRegisterKeys();
          this.isShowModal = 1;
        }
        else {
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Error while share register key.Please try again.");
      });
    }
    else {
      this.toastr.error("Invalid form data.");
    }
  }

  public onChangeUsernameByDCIDorName(DCIDorName) {
    this.sharedService.setLoader(true);
    if (DCIDorName != "") {
      this.userService._getUserDetailsByDCIDorName(DCIDorName).subscribe((res: any) => {
        this.sharedService.setLoader(false);
        if (res.m_Item1) {
          this.ToUserDetails = res.m_Item3;
          this.shareKeyForm.patchValue({
            SharedTo: this.ToUserDetails.UserName,
            SharedUserID: this.ToUserDetails.UserID,
            SharedToName: this.ToUserDetails.FirstName + ' ' + this.ToUserDetails.LastName,
            PhoneNumber: this.ToUserDetails.PhoneNumber
          })
        }
        else {
          this.shareKeyForm.patchValue({
            SharedTo: '',
            SharedToName: ''
          })
          this.toastr.error("Please provide valid user name or DCID");
        }
      }, err => {
        this.sharedService.setLoader(false);
      })
    }
    else {
      this.shareKeyForm.patchValue({
        SharedTo: '',
        SharedToName: ''
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

  getKeyType(KeyType: string) {
    if (KeyType == "P")
      return "Paid";
    else
      return "Free";
  }

  checkUsedKeyHidden(status: string) {
    if (status === "Used")
      return false;
    else if (status === "Issued")
      return true;
  }

  closeForm() {
    this.isShowModal = 1;
  }
}
