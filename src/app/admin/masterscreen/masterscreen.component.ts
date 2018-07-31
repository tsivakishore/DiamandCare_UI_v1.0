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

@Component({
  selector: 'app-masterscreen',
  templateUrl: './masterscreen.component.html',
  styleUrls: ['./masterscreen.component.css'],
  providers: [MasterChargesService],
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

export class MasterscreenComponent extends BaseComponent implements OnInit {
  masterScreenForm: FormGroup;
  isAddressValid: boolean = true;
  masterCharges: any;
  gridTitle: string;
  selectedRow: any;

  constructor(private sharedService: SharedService,
    private masterChargesService: MasterChargesService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.GetMasterCharges();
    this.createmasterScreenForm();
  }

  createmasterScreenForm() {
    this.masterScreenForm = this.fb.group({
      MasterID: [''],
      DocumentationAdminFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      PrepaidLoanCharges: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      AreaFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      DistrictFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      DistrictClusterFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      StateFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      StateClusterFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      MotherFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      SGST: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      CGST: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      IGST: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      TDS: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])]
    })
  }

  AddMasterCharges(formParam, isValid) {
    if (isValid) {
      this.apiManager.postAPI(API.ADDMASTERCHARGES, formParam).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          this.masterCharges = response.m_Item3;
          this.masterScreenForm.patchValue({
            MasterID: this.masterCharges.MasterID,
            DocumentationAdminFee: this.masterCharges.DocumentationAdminFee,
            PrepaidLoanCharges: this.masterCharges.PrepaidLoanCharges,
            AreaFee: this.masterCharges.AreaFee,
            DistrictFee: this.masterCharges.DistrictFee,
            DistrictClusterFee: this.masterCharges.DistrictClusterFee,
            StateFee: this.masterCharges.StateFee,
            StateClusterFee: this.masterCharges.StateClusterFee,
            MotherFee: this.masterCharges.MotherFee,
            SGST: this.masterCharges.SGST,
            CGST: this.masterCharges.CGST,
            IGST: this.masterCharges.IGST,
            TDS: this.masterCharges.TDS
          })
        }
        else
          this.toastr.error(response.m_Item2);
      }, err => {
        console.log(err);
        this.toastr.error("Error while aading master charges. Please try again.");
      });
    }
  }

  public GetMasterCharges() {
    this.sharedService.setLoader(true);
    this.masterChargesService._getMasterCharges().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.masterCharges = res.m_Item3;
        this.masterScreenForm.patchValue({
          MasterID: this.masterCharges.MasterID,
          DocumentationAdminFee: this.masterCharges.DocumentationAdminFee,
          PrepaidLoanCharges: this.masterCharges.PrepaidLoanCharges,
          AreaFee: this.masterCharges.AreaFee,
          DistrictFee: this.masterCharges.DistrictFee,
          DistrictClusterFee: this.masterCharges.DistrictClusterFee,
          StateFee: this.masterCharges.StateFee,
          StateClusterFee: this.masterCharges.StateClusterFee,
          MotherFee: this.masterCharges.MotherFee,
          SGST: this.masterCharges.SGST,
          CGST: this.masterCharges.CGST,
          IGST: this.masterCharges.IGST,
          TDS: this.masterCharges.TDS
        })
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }
}
