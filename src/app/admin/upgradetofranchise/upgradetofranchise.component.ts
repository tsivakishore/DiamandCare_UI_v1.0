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
import { style, transition, animate, trigger } from "@angular/animations";
import { MasterChargesService } from "../../utility/shared-service/mastercharges.service";
import { FranchiseService } from "../../utility/shared-service/franchise.service";

@Component({
  selector: 'app-upgradetofranchise',
  templateUrl: './upgradetofranchise.component.html',
  styleUrls: ['./upgradetofranchise.component.css'],
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
export class UpgradetofranchiseComponent implements OnInit {
  upgradefranchisescreen: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createUpgradeFranchiseForm();
  }

  createUpgradeFranchiseForm() {
    this.upgradefranchisescreen = this.fb.group({
      UserID: [''],
      DocumentationAdminFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      DocumentationAdminFee1: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      PrepaidLoanCharges: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      SGST: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      CGST: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      IGST: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      TDS: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])]
    })
  }
}
