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

@Component({
  selector: 'app-mysecretkeys',
  templateUrl: './mysecretkeys.component.html',
  styleUrls: ['./mysecretkeys.component.css'],
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
export class MysecretkeysComponent extends BaseComponent implements OnInit {

  isShowModal: number = 1;
  listRegKeys: any;
  gridTitle: string;
  selectedRow: any;
  phoneNumberForm: FormGroup;

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
    this.gridTitle = "List of Secret Keys"
  }
  createPhoneNumberForm() {
    this.phoneNumberForm = this.fb.group({
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
}
