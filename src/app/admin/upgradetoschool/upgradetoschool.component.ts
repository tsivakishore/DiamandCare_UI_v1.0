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
import { FranchiseService } from "../../utility/shared-service/franchise.service";
import { CommonService } from "../../utility/shared-service/common.service";
import { SchoolService } from "../../utility/shared-service/school.service";

@Component({
  selector: 'app-upgradetoschool',
  templateUrl: './upgradetoschool.component.html',
  styleUrls: ['./upgradetoschool.component.css'],
  providers: [FranchiseService, CommonService, SchoolService],
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
export class UpgradetoschoolComponent extends BaseComponent implements OnInit {
  frmUpgradeToSchool: FormGroup;
  lstUpgradeTypes: any;
  Username: any;
  UnderFranchiseDetails: any;
  FranchiseTypeDetails: any;
  States: any;
  FranchiseTypeIDDetails: any;
  defaultUnderFranchiseID: any;
  userID: number;
  lstSchools: any;
  isShowModal: number = 1;
  selectedRow: any;
  actiontype: any;

  constructor(private sharedService: SharedService,
    private franchiseService: FranchiseService,
    private commonService: CommonService,
    private schoolService: SchoolService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.createUpgradeSchoolForm();
    this.getStates();
    this.getSchoolDetails();
    this.actiontype = "insert";
  }

  createUpgradeSchoolForm() {
    this.frmUpgradeToSchool = this.fb.group({
      UserID: ['', Validators.compose([Validators.required])],
      UserName: ['', Validators.compose([Validators.required])],
      SchoolName: [''],
      BranchCode: [null],
      Address1: [''],
      Address2: [''],
      City: [''],
      District: [''],
      StateID: [''],
      Country: [''],
      Zipcode: ['']
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
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  onUsernameByDCIDorName(DcIDorName: any) {
    DcIDorName = DcIDorName.UserID;
    if (DcIDorName != "") {
      this.franchiseService._getUsernameByDCIDorName(DcIDorName).subscribe(response => {
        if (response.m_Item1) {
          this.userID = response.m_Item3.UserID
          this.frmUpgradeToSchool.patchValue({
            UserName: response.m_Item3.UserName
          })
        }
        else {
          this.frmUpgradeToSchool.patchValue({
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
        this.FranchiseTypeIDDetails = res.m_Item4;
        if (!!this.UnderFranchiseDetails) {
          this.defaultUnderFranchiseID = this.UnderFranchiseDetails[0].UserID;
          this.frmUpgradeToSchool.controls['UnderFranchiseID'].setValue(this.defaultUnderFranchiseID, { onlySelf: true });
          this.frmUpgradeToSchool.controls['UnderFranchiseID'].setValidators(null);
          this.frmUpgradeToSchool.get('UnderFranchiseID').updateValueAndValidity({ onlySelf: false, emitEvent: false });
        }
        if (!!this.FranchiseTypeIDDetails) {
          this.frmUpgradeToSchool.patchValue({
            FranchiseJoinees: this.FranchiseTypeIDDetails.TargetJoineesPerMonth,
            FranchiseJoineesMinimum: this.FranchiseTypeIDDetails.MinimumJoineesAvg
          })
        }
      }
      else {
        this.UnderFranchiseDetails = null;
        this.frmUpgradeToSchool.controls['UnderFranchiseID'].setValue('', { onlySelf: true });
        this.frmUpgradeToSchool.controls['UnderFranchiseID'].setValidators(Validators.compose([Validators.required]));
        this.frmUpgradeToSchool.get('UnderFranchiseID').updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
    }, err => {
      this.sharedService.setLoader(false);
      console.log(err);
    })
  }

  public getSchoolDetails() {
    this.sharedService.setLoader(true);
    this.schoolService._getSchoolDetails().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstSchools = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }
  EditSchool(rowIndex) {
    this.isShowModal = 2;
    this.createUpgradeSchoolForm();
    this.actiontype = "update"
    this.selectedRow = this.lstSchools[rowIndex];
    this.frmUpgradeToSchool.patchValue({
      UserID: this.selectedRow.UserID,
      UserName: this.selectedRow.UserName,
      SchoolName: this.selectedRow.SchoolName,
      BranchCode: this.selectedRow.BranchCode,
      Address1: this.selectedRow.Address1,
      Address2: this.selectedRow.Address2,
      City: this.selectedRow.City,
      District: this.selectedRow.District,
      StateID: this.selectedRow.StateID,
      Country: this.selectedRow.Country,
      Zipcode: this.selectedRow.Zipcode
    })
    this.frmUpgradeToSchool.controls['StateID'].setValue(this.selectedRow.StateID, { onlySelf: true });
    this.userID = this.selectedRow.UserID;
    // this.frmUpgradeToFranchise.patchValue({
    // FranchiseType: this.selectedRow.FranchiseType,
    // })
  }

  public getStates() {
    this.sharedService.setLoader(true);
    this.commonService._getStates().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.States = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  public UpgradeToSchool(formUpgradeToSchool, isValidForm) {
    if (isValidForm) {
      formUpgradeToSchool.UserID = this.userID;
      if (this.actiontype == "insert") {
        this.apiManager.postAPI(API.INSERTSCHOOLDETAILS, formUpgradeToSchool).subscribe(response => {
          if (response.m_Item1) {
            this.frmUpgradeToSchool.reset();
            this.toastr.success(response.m_Item2);
            this.getSchoolDetails();
          }
          else
            this.toastr.error(response.m_Item2);
        }, err => {
          console.log(err);
          this.toastr.error("Error while upgrade school. Please try again.");
        });
      }
      else {
        this.apiManager.postAPI(API.UPDATESCHOOLDETAILS, formUpgradeToSchool).subscribe(response => {
          if (response.m_Item1) {
            this.frmUpgradeToSchool.reset();
            this.toastr.success(response.m_Item2);
            this.getSchoolDetails();
          }
          else
            this.toastr.error(response.m_Item2);
        }, err => {
          console.log(err);
          this.toastr.error("Error while upgrade school. Please try again.");
        });
      }
    }
  }

}
