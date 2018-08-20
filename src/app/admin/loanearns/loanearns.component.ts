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
import { LoanEarnsService } from "../../utility/shared-service/loanEarns.service";
import { CommonService } from "../../utility/shared-service/common.service";

@Component({
  selector: 'app-loanearns',
  templateUrl: './loanearns.component.html',
  styleUrls: ['./loanearns.component.css'],
  providers: [LoanEarnsService, CommonService],
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

export class LoanearnsComponent extends BaseComponent implements OnInit {
  isShowModal: number = 1;
  frmApplyPLLoan: FormGroup;
  frmApplyFeeReimbursement: FormGroup;
  frmApplyHealthBenefits: FormGroup;
  frmApplyRiskBenefit: FormGroup;
  frmApplyHomeLoan: FormGroup;
  frmApplyPrepaidLoan: FormGroup;

  isAddressValid: boolean = true;
  renewalStatus: boolean = false;
  listOfEarnLoans: any[];
  lstPaidLoans: any[];
  gridTitle: string;
  selectedRow: any;
  lstModeofTransfer: any[];
  feesReimbursementValue: any;
  healthBenefitValue: any;
  riskBenefitValue: any;

  fileKYCDocument: string = "Upload KYC document";
  fileBonafideCertificate: string = "Upload bonafide certificate";
  fileFeeReceiptDocument: string = "Upload fee receipt document";
  fileHospitalAdmission: string = "Upload hospital admitted document";
  fileEstimatedHospitalCharges: string = "Upload estimated hospital charges document";
  fileDeathCertificate: string = "Upload death certificate";
  fileOtherDocument: string = "Other document";

  private file: any;
  private name: any;
  myFiles: string[] = [];

  isValidKYCDocument: boolean = false;
  isValidBonafideFile: boolean = false;
  isValidFeeReceiptFile: boolean = false;
  isValidFeeOtherFile: boolean = false;

  isValidHBKYCDocument: boolean = false;
  isValidHospitalAdmissionFile: boolean = false;
  isValidEstimatedHospitalChargesFile: boolean = false;
  isValidEstimatedHospitalOtherFile: boolean = false;

  isValidRBKYCDocument: boolean = false;
  isValidDeathCertificateFileNameFile: boolean = false;
  isValidRiskBenefitOtherFile: boolean = false;

  msgError: string;

  constructor(private sharedService: SharedService,
    private loanEarnsService: LoanEarnsService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    //this.GetPaidLoans();
    this.GetLoans();
    this.GetModeofTransfer();
    this.createApplyPLLoanForm();
    this.createApplyFeeReimbursementForm();
    this.createApplyHealthBenefitsForm();
    this.createApplyRiskBenefitForm();
  }

  createApplyPLLoanForm() {
    this.frmApplyPLLoan = this.fb.group({
      GroupID: new FormControl(''),
      LoanAmount: new FormControl(''),
      ModeofTransfer: new FormControl(''),
      LoanTypeCode: new FormControl(''),
      PrePaidLoan: false
    })
  }

  createApplyFeeReimbursementForm() {
    this.frmApplyFeeReimbursement = this.fb.group({
      GroupID: new FormControl(''),
      LoanAmount: new FormControl('', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_REGEXP)])),
      LoanTypeCode: new FormControl(''),
      ModeofTransfer: new FormControl(''),
      KYCDocumentName: new FormControl('', Validators.compose([Validators.required])),
      KYCDocumentContent: new FormControl(''),
      BonafideFileName: new FormControl('', Validators.compose([Validators.required])),
      BonafideContent: new FormControl(''),
      FeeReceiptFileName: new FormControl('', Validators.compose([Validators.required])),
      FeeReceiptContent: new FormControl(''),
      FeeReimbursementOtherFile: new FormControl(''),
      FeeReimbursementOtherContent: new FormControl('')
    })
  }

  createApplyHealthBenefitsForm() {
    this.frmApplyHealthBenefits = this.fb.group({
      GroupID: new FormControl(''),
      LoanAmount: new FormControl(''),
      LoanTypeCode: new FormControl(''),
      ModeofTransfer: new FormControl(''),
      KYCDocumentName: new FormControl('', Validators.compose([Validators.required])),
      KYCDocumentContent: new FormControl(''),
      HospitalAdmissionFormName: new FormControl('', Validators.compose([Validators.required])),
      HospitalAdmissionFormContent: new FormControl(''),
      EstimatedHospitalChargesDocName: new FormControl('', Validators.compose([Validators.required])),
      EstimatedHospitalChargesDocContent: new FormControl(''),
      EstimatedHospitalOtherFile: new FormControl(''),
      EstimatedHospitalOtherContent: new FormControl('')
    })
  }

  createApplyRiskBenefitForm() {
    this.frmApplyRiskBenefit = this.fb.group({
      GroupID: new FormControl(''),
      LoanAmount: new FormControl(''),
      LoanTypeCode: new FormControl(''),
      ModeofTransfer: new FormControl(''),
      KYCDocumentName: new FormControl('', Validators.compose([Validators.required])),
      KYCDocumentContent: new FormControl(''),
      DeathCertificateFileName: new FormControl('', Validators.compose([Validators.required])),
      DeathCertificateContent: new FormControl(''),
      RiskBenefitOtherFile: new FormControl(''),
      RiskBenefitOtherContent: new FormControl('')
    })
  }

  createApplyHomeLoanForm() {
    this.frmApplyHomeLoan = this.fb.group({
      GroupID: new FormControl(''),
      ModeofTransfer: new FormControl(''),
      LoanTypeCode: new FormControl('')
    })
  }

  createApplyPrepaidLoanForm() {
    this.frmApplyPrepaidLoan = this.fb.group({
      GroupID: new FormControl('')
    })
  }

  public GetLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getLoans().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listOfEarnLoans = res.m_Item3;
        this.checkRenewalStatus();
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  public GetPaidLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getPaidLoansByUserID().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstPaidLoans = res.m_Item3;
      }
      else {
        this.lstPaidLoans = [];
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }


  public GetModeofTransfer() {
    this.commonService._getModeofTransfer().subscribe((res: any) => {
      if (res.m_Item1) {
        this.lstModeofTransfer = res.m_Item3;
      }
    }, err => {
      console.log(err);
    })
  }

  public checkRenewalStatus() {
    this.loanEarnsService._checkRenewalStatus().subscribe((res: any) => {
      this.renewalStatus = res.m_Item1;
    }, err => {
      console.log(err);
    })
  }

  // Start Personal lone code
  ApplyPersonalLoan(rowIndex) {
    try {
      this.loanEarnsService._checkPLExist().subscribe((res: any) => {
        if (res.m_Item1) {
          this.isShowModal = 2;//Personal loan Form open
          this.createApplyPLLoanForm();
          this.selectedRow = this.listOfEarnLoans[rowIndex];
          this.frmApplyPLLoan.patchValue({
            GroupID: this.selectedRow.Groups,
            LoanAmount: this.selectedRow.EPLoans,
            LoanTypeCode: 'PL'
          })
        }
        else {
          this.frmApplyPLLoan.reset();
          this.toastr.error(res.m_Item2);
        }
      }, err => {
        this.toastr.error("Oops! Error while checking personal loan.");
      });
    }
    finally {

    }
  }

  onApplyPLLoan(formApplyPLLoan: any, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.PERSONALLOAN, formApplyPLLoan).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.frmApplyPLLoan.reset();
        }
        else {
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Oops! There has been an error while applying personal loan.Please try again.");
      });
    }
    else {
      this.toastr.error("Form is not valid");
    }
  }
  // End Personal lone code

  //Start Fees Reimbursement code
  ApplyFeesReimbursement(rowIndex) {
    try {
      this.loanEarnsService._checkFRExist().subscribe((res: any) => {
        if (res.m_Item1) {
          this.isShowModal = 3;//Fee Reimbursement Form open
          this.createApplyFeeReimbursementForm();
          this.selectedRow = this.listOfEarnLoans[rowIndex];
          this.frmApplyFeeReimbursement.patchValue({
            GroupID: this.selectedRow.Groups,
            LoanAmount: this.selectedRow.FeesReimbursement,
            LoanTypeCode: 'FR'
          })
        }
        else {
          this.toastr.error(res.m_Item2);
        }
      }, err => {
        this.toastr.error("Oops! Error while checking fee reimbursement.");
      });
    }
    finally {
      //this.sharedService.setLoader(false);
    }
  }

  onApplyFeeReimbursement(formApplyFeeReimbursement: any, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.FEEREIMBURSEMENT, formApplyFeeReimbursement, this.myFiles).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.frmApplyFeeReimbursement.reset();
        }
        else {
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Oops! There has been an error while applying fee reimbursement.Please try again.");
      });
    }
    else {
      this.toastr.error("Form is not valid");
    }
  }
  //End Fees Reimbursement code

  //Start Health Benefit code
  ApplyHealthBenefit(rowIndex) {
    try {
      this.loanEarnsService._checkHBExist().subscribe((res: any) => {
        if (res.m_Item1) {
          this.isShowModal = 4;
          this.createApplyHealthBenefitsForm();
          this.selectedRow = this.listOfEarnLoans[rowIndex];
          this.frmApplyHealthBenefits.patchValue({
            GroupID: this.selectedRow.Groups,
            LoanAmount: this.selectedRow.EPLoans,
            LoanTypeCode: 'HB'
          })
        }
        else {
          this.toastr.error(res.m_Item2);
        }
      }, err => {
        this.toastr.error("Oops! Error while checking health loan.");
      });
    }
    finally {
      //this.sharedService.setLoader(false);
    }
  }

  onApplyHealthBenefits(formApplyHealthBenefits: any, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.HEALTHBENEFITS, formApplyHealthBenefits, this.myFiles).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.frmApplyHealthBenefits.reset();
        }
        else {
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Oops! There has been an error while applying health benefits.Please try again.");
      });
    }
    else {
      this.toastr.error("Invalid form data.");
    }
  }
  //End Health Benefit code

  //Start Risk Benefit Loan code
  ApplyRiskBenefitLoan(rowIndex) {
    try {
      this.loanEarnsService._checkRBExist().subscribe((res: any) => {
        if (res.m_Item1) {
          this.isShowModal = 5;
          this.createApplyRiskBenefitForm();
          this.selectedRow = this.listOfEarnLoans[rowIndex];
          this.frmApplyRiskBenefit.patchValue({
            GroupID: this.selectedRow.Groups,
            LoanAmount: this.selectedRow.EPLoans,
            LoanTypeCode: 'RB'
          })
        }
        else {
          this.toastr.error(res.m_Item2);
        }
      }, err => {
        this.toastr.error("Oops! Error while checking risk benefit.");
      });
    }
    finally {
      //this.sharedService.setLoader(false);
    }
  }

  onApplyRiskBenefit(formApplyRiskBenefit: any, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.RISKBENEFITS, formApplyRiskBenefit, this.myFiles).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.frmApplyRiskBenefit.reset();
        }
        else {
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Oops! There has been an error while applying risk benefit.Please try again.");
      });
    }
    else {
      this.toastr.error("Invalid form data.");
    }
  }

  //End Risk Benefit Loan code

  //Start Home Loan code
  ApplyHomeLoan(rowIndex) {
    try {
      this.isShowModal = 6;
      this.createApplyHomeLoanForm();
      this.selectedRow = this.listOfEarnLoans[rowIndex];
      this.frmApplyHomeLoan.patchValue({
        GroupID: this.selectedRow.Groups,
        LoanAmount: this.selectedRow.EPLoans,
        LoanTypeCode: 'HL'
      })
    }
    finally {
      //this.sharedService.setLoader(false);
    }
  }

  onApplyHomeLoan(formApplyHomeLoan: any, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.HOMELOAN, formApplyHomeLoan).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.frmApplyHomeLoan.reset();
        }
        else {
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Oops! There has been an error while applying home loan.Please try again.");
      });
    }
    else {
      this.toastr.error("Invalid form data.");
    }
  }
  //End Home Loan code

  //Start Prepaid Loan code
  ApplyPrepaidLoan(rowIndex) {
    try {
      this.loanEarnsService._checkHBExist().subscribe((res: any) => {
        if (res.m_Item1) {
          this.isShowModal = 2;
          this.createApplyPrepaidLoanForm();
          this.selectedRow = this.listOfEarnLoans[rowIndex];
          this.frmApplyPLLoan.patchValue({
            GroupID: this.selectedRow.Groups,
            LoanAmount: this.selectedRow.EPLoans,
            LoanTypeCode: 'PL',
            PrePaidLoan: true
          })
        }
        else {
          this.toastr.error(res.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Oops! There has been an error while applying health benefits.Please try again.");
      });
    }
    finally {
      //this.sharedService.setLoader(false);
    }
  }

  onApplyPrepaid(frmApplyPrepaidLoan: any, isValidForm) {
    if (isValidForm) {

    }
  }
  //End Prepaid Loan code

  filterPLChanged(selectedValue: any) {
    if (selectedValue != 0) {
      this.frmApplyPLLoan.get('ModeofTransfer').clearValidators();
    }
  }

  filterFRChanged(selectedValue: any) {
    if (selectedValue != 0) {
      this.frmApplyFeeReimbursement.get('ModeofTransfer').clearValidators();
    }
  }

  filterHBChanged(selectedValue: any) {
    if (selectedValue != 0) {
      this.frmApplyHealthBenefits.get('ModeofTransfer').clearValidators();
    }
  }

  filterRBChanged(selectedValue: any) {
    if (selectedValue != 0) {
      this.frmApplyRiskBenefit.get('ModeofTransfer').clearValidators();
    }
  }

  checkLoanEligibility(LoanStatus: string, Groups: number) {

    if (LoanStatus == "NotEligible") {
      return true;
    }
    else if (LoanStatus == "Eligible") {
      return false;
    }
  }

  checkRenewEnable() {
    if (this.renewalStatus == false) {
      return true;
    }
    else if (this.renewalStatus == true) {
      if (!!this.listOfEarnLoans) {
        if (this.listOfEarnLoans.filter(obj => obj.LoanStatus == "Eligible").length >= 3)
          return false;
        else
          return true;
      }
    }
  }

  colorCodeRenew() {
    if (this.renewalStatus == false) {
      return "btnnoteligible";
    }
    else if (this.renewalStatus == true) {
      if (this.listOfEarnLoans.filter(obj => obj.LoanStatus == "Eligible").length >= 3)
        return "btneligible";
      else
        return "btnnoteligible";
    }
  }

  checkPrepaidLoanEligibility(LoanStatus: string, gid: number) {
    if (LoanStatus == "NotEligible")
      return true;
    else
      return false;
  }

  checkHomeLoanEligibility(LoanStatus: string, GroupID: number) {
    if (LoanStatus == "NotEligible") {
      return true;
    }
    else if (LoanStatus == "Eligible" && GroupID == 10) {
      return false;
    }
  }

  checkHomeLoanHidden(LoanStatus: string, GroupID: number) {
    if (LoanStatus == "NotEligible" && GroupID == 10) {
      return true;
    }
    else if (LoanStatus == "NotEligible") {
      return false;
    }
    else if (LoanStatus == "Eligible" && GroupID == 10) {
      return true;
    }
  }

  checkPrepaidLoanHidden(loanAmount: number, groupID: number) {
    if (loanAmount > 0 && groupID != 1) {
      return true;
    }
    else {
      return false;
    }
  }

  checkFeesReimbursementHidden(loanAmount: number) {
    if (loanAmount > 0) {
      this.feesReimbursementValue = loanAmount;
      return true;
    }
    else {
      this.feesReimbursementValue = '';
      return false;
    }
  }

  checkHidden(loanAmount: number) {
    if (loanAmount > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  checkHealthBenefitHidden(loanAmount: number) {
    if (loanAmount > 0) {
      this.healthBenefitValue = loanAmount;
      return true;
    }
    else {
      this.healthBenefitValue = '';
      return false;
    }
  }

  checkRiskBenefitHidden(loanAmount: number) {
    if (loanAmount > 0) {
      this.riskBenefitValue = loanAmount;
      return true;
    }
    else {
      this.riskBenefitValue = '';
      return false;
    }
  }

  colorCode(LoanStatus: string) {
    if (LoanStatus == "NotEligible") {
      return "btnnoteligible";
    }
    else if (LoanStatus == "Eligible") {
      return "btneligible";
    }
  }

  public selectFeeReimbursementFiles(value, documentType: string) {
    let files: FileList = value.files;
    this.file = files[0];

    this.isValidKYCDocument = false;
    this.isValidBonafideFile = false;
    this.isValidFeeReceiptFile = false;
    this.isValidFeeOtherFile = false;

    if ((/\.(pdf|jpg|jpeg|png)$/i).test(this.file.name)) {
      if (documentType == "KYC") {
        this.frmApplyFeeReimbursement.patchValue({ KYCDocumentName: this.file.name, KYCDocumentContent: this.file })
      }
      else if (documentType == "BC") {
        this.frmApplyFeeReimbursement.patchValue({ BonafideFileName: this.file.name, BonafideContent: this.file })
      }
      else if (documentType == "FR") {
        this.frmApplyFeeReimbursement.patchValue({ FeeReceiptFileName: this.file.name, FeeReceiptContent: this.file })
      }
      else if (documentType == "FRO") {
        this.frmApplyFeeReimbursement.patchValue({ FeeReimbursementOtherFile: this.file.name, FeeReimbursementOtherContent: this.file })
      }
      this.file = "";
    }
    else {
      if (documentType == "KYC") {
        this.isValidKYCDocument = true;
        this.frmApplyFeeReimbursement.value.KYCDocumentName = "";
      }
      else if (documentType == "BC") {
        this.isValidBonafideFile = true;
        this.frmApplyFeeReimbursement.value.BonafideFileName = "";
      }
      else if (documentType == "FR") {
        this.isValidFeeReceiptFile = true;
        this.frmApplyFeeReimbursement.value.FeeReceiptFileName = "";
      }
      else if (documentType == "FRO") {
        this.isValidFeeOtherFile = true;
        this.frmApplyFeeReimbursement.value.FeeReimbursementOtherFile = "";
      }

      this.msgError = "Only acept jpg, jpeg, png, pdf files.";
    }
  }

  public selectHealthBenifitsFiles(value, documentType: string) {
    let files: FileList = value.files;
    this.file = files[0];

    this.isValidHBKYCDocument = false;
    this.isValidHospitalAdmissionFile = false;
    this.isValidEstimatedHospitalChargesFile = false;
    this.isValidEstimatedHospitalOtherFile = false;

    if ((/\.(pdf|jpg|jpeg|png)$/i).test(this.file.name)) {
      if (documentType == "KYC") {
        this.frmApplyHealthBenefits.patchValue({ KYCDocumentName: this.file.name, KYCDocumentContent: this.file })
      }
      else if (documentType == "HA") {
        this.frmApplyHealthBenefits.patchValue({ HospitalAdmissionFormName: this.file.name, HospitalAdmissionFormContent: this.file })
      }
      else if (documentType == "HC") {
        this.frmApplyHealthBenefits.patchValue({ EstimatedHospitalChargesDocName: this.file.name, EstimatedHospitalChargesDocContent: this.file })
      }
      else if (documentType == "EHO") {
        this.frmApplyHealthBenefits.patchValue({ EstimatedHospitalOtherFile: this.file.name, EstimatedHospitalOtherContent: this.file })
      }
      this.file = "";
    }
    else {
      if (documentType == "KYC") {
        this.isValidHBKYCDocument = true;
        this.frmApplyHealthBenefits.value.KYCDocumentName = "";
      }
      else if (documentType == "HA") {
        this.isValidHospitalAdmissionFile = true;
        this.frmApplyHealthBenefits.value.HospitalAdmissionFormName = "";
      }
      else if (documentType == "HC") {
        this.isValidEstimatedHospitalChargesFile = true;
        this.frmApplyHealthBenefits.value.EstimatedHospitalChargesDocName = "";
      }
      else if (documentType == "EHO") {
        this.isValidEstimatedHospitalOtherFile = true;
        this.frmApplyHealthBenefits.value.EstimatedHospitalOtherFile = "";
      }

      this.msgError = "Only acept jpg, jpeg, png, pdf files.";
    }
  }

  public selectRiskBenifitsFiles(value, documentType: string) {
    let files: FileList = value.files;
    this.file = files[0];

    this.isValidRBKYCDocument = false;
    this.isValidDeathCertificateFileNameFile = false;
    this.isValidRiskBenefitOtherFile = false;

    if ((/\.(pdf|jpg|jpeg|png)$/i).test(this.file.name)) {
      if (documentType == "KYC") {
        this.frmApplyRiskBenefit.patchValue({ KYCDocumentName: this.file.name, KYCDocumentContent: this.file })
      }
      else if (documentType == "DC") {
        this.frmApplyRiskBenefit.patchValue({ DeathCertificateFileName: this.file.name, DeathCertificateContent: this.file })
      }
      else if (documentType == "ROD") {
        this.frmApplyRiskBenefit.patchValue({ RiskBenefitOtherFile: this.file.name, RiskBenefitOtherContent: this.file })
      }
      this.file = "";
    }
    else {
      if (documentType == "KYC") {
        this.isValidRBKYCDocument = true;
        this.frmApplyRiskBenefit.value.KYCDocumentName = "";
      }
      else if (documentType == "DC") {
        this.isValidDeathCertificateFileNameFile = true;
        this.frmApplyRiskBenefit.value.DeathCertificateFileName = "";
      }
      else if (documentType == "ROD") {
        this.isValidRiskBenefitOtherFile = true;
        this.frmApplyRiskBenefit.value.RiskBenefitOtherFile = "";
      }

      this.msgError = "Only acept jpg, jpeg, png, pdf files.";
    }
  }

  closeForm() {
    this.isShowModal = 1;
  }

}
