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
  isAddressValid: boolean = true;
  listRegKeys: any;
  gridTitle: string;
  selectedRow: any;
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
    this.is_Visible_Single = true;
  }

  createsecretkeyForm() {
    this.secretkeyForm = this.fb.group({
      PhoneNumber: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])],
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

}
