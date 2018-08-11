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
  selector: 'app-masterscreen',
  templateUrl: './masterscreen.component.html',
  styleUrls: ['./masterscreen.component.css'],
  providers: [MasterChargesService, FranchiseService],
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
  lstFranchise: any;
  gridTitle: string;
  selectedRow: any;
  isShowModal: number = 1;
  fgFranchise: FormGroup;
  fgWallet: FormGroup;
  userID: number;


  constructor(private sharedService: SharedService,
    private masterChargesService: MasterChargesService,
    private franchiseService: FranchiseService,
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
    this.getFranchiseMasterDetails();
  }

  createFranchiseForm() {
    this.fgFranchise = this.fb.group({
      ID: new FormControl(''),
      FranchiseType: new FormControl(''),
      PaymentReceiptPercentage: new FormControl(''),
      TargetJoineesPerMonth: new FormControl(''),
      MinimumJoineesAvg: new FormControl(''),
    })
  }
  createWalletForm() {
    this.fgWallet = this.fb.group({
      UserID: ['', Validators.compose([Validators.required])],
      UserName: ['', Validators.compose([Validators.required])],
      AvailableBalance: [''],
      AddBalance: ['', Validators.compose([Validators.required])]
    })
  }

  onAddBalanceToWallet() {
    this.createWalletForm();
    this.isShowModal = 3;
  }

  getFranchiseUsernameWalletByIDorName(DcIDorName: any) {
    DcIDorName = DcIDorName.UserID;
    if (DcIDorName != "") {
      this.franchiseService._getFranchiseUsernameWalletByIDorName(DcIDorName).subscribe(response => {
        if (response.m_Item1) {
          this.userID = response.m_Item3.UserID
          this.fgWallet.patchValue({
            UserName: response.m_Item3.UserName,
            AvailableBalance: response.m_Item4.Balance
          })
        }
        else {
          this.fgWallet.patchValue({
            UserName: ''
          })
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.toastr.error("Oops! There has been an error from server. Please try again.");
      })
    }
  }
  public onSaveBalance(FgWallet, isValidForm) {
    if (isValidForm) {
      FgWallet.UserID = this.userID;
      this.apiManager.postAPI(API.UPDATEFRANCHISEWALLETBALANCE, FgWallet).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.fgWallet.reset();
          this.toastr.success(response.m_Item2);
        }
        else {
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        console.log(err);
        this.toastr.error("Error while upgrade franchise. Please try again.");
      });
    }
  }
  createmasterScreenForm() {
    this.masterScreenForm = this.fb.group({
      MasterID: [''],
      DocumentationAdminFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      DocumentationAdminFee1: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      PrepaidLoanCharges: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      RegistrationCharges: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      // AreaFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      // DistrictFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      // DistrictClusterFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      // StateFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      // StateClusterFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
      // MotherFee: ['', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_FLOAT_REGEXP)])],
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
            DocumentationAdminFee1: this.masterCharges.DocumentationAdminFee1,
            PrepaidLoanCharges: this.masterCharges.PrepaidLoanCharges,
            // AreaFee: this.masterCharges.AreaFee,
            // DistrictFee: this.masterCharges.DistrictFee,
            // DistrictClusterFee: this.masterCharges.DistrictClusterFee,
            // StateFee: this.masterCharges.StateFee,
            // StateClusterFee: this.masterCharges.StateClusterFee,
            // MotherFee: this.masterCharges.MotherFee,
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
          DocumentationAdminFee1: this.masterCharges.DocumentationAdminFee1,
          PrepaidLoanCharges: this.masterCharges.PrepaidLoanCharges,
          RegistrationCharges: this.masterCharges.RegistrationCharges,
          // AreaFee: this.masterCharges.AreaFee,
          // DistrictFee: this.masterCharges.DistrictFee,
          // DistrictClusterFee: this.masterCharges.DistrictClusterFee,
          // StateFee: this.masterCharges.StateFee,
          // StateClusterFee: this.masterCharges.StateClusterFee,
          // MotherFee: this.masterCharges.MotherFee,
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

  public getFranchiseMasterDetails() {
    this.sharedService.setLoader(true);
    this.franchiseService._getFranchiseMasterDetails().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        console.log(res.m_Item3);
        this.lstFranchise = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  EditFranchise(rowIndex) {
    this.isShowModal = 2;
    this.createFranchiseForm();
    this.selectedRow = this.lstFranchise[rowIndex];
    this.fgFranchise.patchValue({
      ID: this.selectedRow.ID,
      FranchiseType: this.selectedRow.FranchiseType,
      PaymentReceiptPercentage: this.selectedRow.PaymentReceiptPercentage,
      TargetJoineesPerMonth: this.selectedRow.TargetJoineesPerMonth,
      MinimumJoineesAvg: this.selectedRow.MinimumJoineesAvg
    })

  }
  onEditFranchise(frmdata: any, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.EDITFRANCHISE, frmdata).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.fgFranchise.reset();
          this.getFranchiseMasterDetails();
        }
        else {
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Oops! There has been an error while updating franchise details .Please try again.");
      });
    }
    else {
      this.toastr.error("Form is not valid");
    }
  }

  closeForm() {
    this.isShowModal = 1;
  }

}
