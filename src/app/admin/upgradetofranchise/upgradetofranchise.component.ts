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
import { FranchiseService } from "../../utility/shared-service/franchise.service";

@Component({
  selector: 'app-upgradetofranchise',
  templateUrl: './upgradetofranchise.component.html',
  styleUrls: ['./upgradetofranchise.component.css'],
  providers: [FranchiseService],
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

export class UpgradetofranchiseComponent extends BaseComponent implements OnInit {
  frmUpgradeToFranchise: FormGroup;
  lstUpgradeTypes: any;
  Username: any;
  UnderFranchiseDetails: any;
  FranchiseTypeDetails: any;
  defaultUnderFranchiseID: any;

  constructor(private sharedService: SharedService,
    private franchiseService: FranchiseService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.createUpgradeFranchiseForm();
    this.getFranchiseMasterDetails();
  }

  createUpgradeFranchiseForm() {
    this.frmUpgradeToFranchise = this.fb.group({
      UserID: ['', Validators.compose([Validators.required])],
      UserName: ['', Validators.compose([Validators.required])],
      UpgradeTo: [''],
      FranchiseTypeID: [''],
      UnderFranchiseID: [''],
      ConditionsApplySelf: [''],
      ConditionsApplyUnderJoinees: [''],
      FranchiseJoinees: [''],
      FranchiseJoineesMinimum: ['']
    })
  }

  public getUpgradeTo() {
    this.sharedService.setLoader(true);
    this.franchiseService._getUpgradeTo().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstUpgradeTypes = res.m_Item3;
      }
    }, err => {
      debugger;
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  // public getUsernameByDCIDorName() {
  //   this.sharedService.setLoader(true);
  //   this.franchiseService._getUsernameByDCIDorName().subscribe((res: any) => {
  //     this.sharedService.setLoader(false);
  //     if (res.m_Item1) {
  //       this.Username = res.m_Item3;
  //     }
  //   }, err => {
  //     console.log(err);
  //     this.sharedService.setLoader(false);
  //   })
  // }

  getUsernameByDCIDorName(DcIDorName: any) {
    if (DcIDorName != "") {
      this.franchiseService._getUsernameByDCIDorName(DcIDorName.UserID).subscribe(response => {
        if (response.m_Item1) {
          this.frmUpgradeToFranchise.patchValue({
            UserName: response.m_Item3.UserName
          })
        }
        else {
          this.frmUpgradeToFranchise.patchValue({
            UserName: ''
          })
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.toastr.error("Oops! There has been an error from server. Please try again.");
      })
    }
  }

  public getUnderFranchiseDetails(FranchiseType: any) {
    this.sharedService.setLoader(true);
    this.franchiseService._getUnderFranchiseDetails(FranchiseType).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.UnderFranchiseDetails = res.m_Item3;
        if (!!this.UnderFranchiseDetails) {
          this.defaultUnderFranchiseID = this.UnderFranchiseDetails[0].UserID;
          this.frmUpgradeToFranchise.controls['UnderFranchiseID'].setValue(this.defaultUnderFranchiseID, { onlySelf: true });
        }
      }
      else {
        this.UnderFranchiseDetails = [];
      }
    }, err => {
      this.sharedService.setLoader(false);
      console.log(err);
    })
  }

  public getFranchiseMasterDetails() {
    this.sharedService.setLoader(true);
    this.franchiseService._getFranchiseMasterDetails().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.FranchiseTypeDetails = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

}
