import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { style, transition, animate, trigger } from "@angular/animations";
import { dialog, slideUp } from "../animation";
import { LoanEarnsService } from "../../utility/shared-service/loanEarns.service";
import { CommonService } from "../../utility/shared-service/common.service";
import { SharedService } from "../../utility/shared-service/shared.service";
import { ToastsManager } from "ng2-toastr";
import { API } from "../../utility/constants/api";
import { APIManager } from "../../utility/shared-service/apimanager.service";

@Component({
  selector: 'app-appliedloandetails',
  templateUrl: './appliedloandetails.component.html',
  styleUrls: ['./appliedloandetails.component.css'],
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
    slideUp, dialog
  ]
})

export class AppliedloandetailsComponent implements OnInit {
  isShowModal: number = 1;
  frmLoanDetails: FormGroup;

  OriginalLoanDetailsList: any[];
  loanDetailsList: any[];

  listOfApprovedLoans: any[];
  listOfPendingLoans: any[];
  OriginalPendingLoans: any[];
  listOfRejectedLoans: any[];

  selectedLoanDetails: any;
  userID: string;
  loanID: number;
  selectedLoanID: number;

  LoanID: number;
  GroupID: number;
  UserID: number;
  LoanAmount: any;
  IssuedAmount: any;
  AmountToPay: any;
  AdminCharges: any;
  ModeofTransfer: number;
  ModeofTransferStr: string;
  LoanStatusID: number;
  LoanStatus: string;
  LoanTypeCode: string;
  CreatedBy: number;
  CreatedOn: any;
  IsApproved: any;
  SGST: any;
  CGST: any;
  IGST: any;
  TDS: any;
  loanDocumentdList: any;
  isTitle: boolean = false;

  constructor(public fb: FormBuilder,
    private loanEarnsService: LoanEarnsService,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    private sharedService: SharedService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.createLoanDetailsForm();
    this.GetApprovedLoans();
    this.GetPendingLoans();
    this.GetPendingLoans();
  }

  createLoanDetailsForm() {
    this.frmLoanDetails = this.fb.group({
      LoanID: new FormControl(''),
      UserID: new FormControl(''),
      GroupID: new FormControl(''),
      IsApproved: new FormControl('')
    })
  }

  public GetApprovedLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getApprovedLoans().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listOfApprovedLoans = res.m_Item3;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  public GetPendingLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getPendingLoans().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.OriginalPendingLoans = res.m_Item3;
        this.listOfPendingLoans = this.OriginalPendingLoans;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  public GetRejectedLoans() {
    this.sharedService.setLoader(true);
    this.loanEarnsService._getRejectedLoans().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listOfRejectedLoans = res.m_Item3;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  ViewLoanDetails(rowIndex) {
    try {
      this.sharedService.setLoader(true);
      this.selectedLoanDetails = this.OriginalPendingLoans[rowIndex];
      this.selectedLoanID = this.selectedLoanDetails.LoanID;
      this.loanEarnsService._getLoanDetailsByLoanID(this.selectedLoanID).then((res: any) => {
        this.sharedService.setLoader(false);
        if (res.m_Item1) {
          this.loanDocumentdList = res.m_Item3;
          this.isShowModal = 2;
          this.LoanID = this.selectedLoanDetails.LoanID;
          this.GroupID = this.selectedLoanDetails.GroupID;
          this.UserID = this.selectedLoanDetails.UserID;
          this.LoanAmount = this.selectedLoanDetails.LoanAmount;
          this.IssuedAmount = this.selectedLoanDetails.IssuedAmount;
          this.AmountToPay = this.selectedLoanDetails.AmountToPay;
          this.AdminCharges = this.selectedLoanDetails.AdminCharges;
          this.ModeofTransfer = this.selectedLoanDetails.ModeofTransfer;
          this.ModeofTransferStr = this.getModeofTransfer(this.selectedLoanDetails.ModeofTransfer);
          this.LoanStatusID = this.selectedLoanDetails.LoanStatusID;
          this.LoanStatus = this.getLoanStatus(this.LoanStatusID);
          //this.LoanTypeCode = this.selectedLoanDetails.LoanTypeCode;
          this.LoanTypeCode = this.getLoanType(this.selectedLoanDetails.LoanTypeCode);
          this.CreatedBy = this.selectedLoanDetails.CreatedBy;
          this.CreatedOn = this.selectedLoanDetails.CreatedOn;
          this.IsApproved = this.IsLoanApproved(this.selectedLoanDetails.IsApproved);
          this.SGST = this.selectedLoanDetails.SGST;
          this.CGST = this.selectedLoanDetails.CGST;
          this.IGST = this.selectedLoanDetails.IGST;
          this.TDS = this.selectedLoanDetails.TDS;

          this.frmLoanDetails.value.LoanID = this.LoanID;
          this.frmLoanDetails.value.GroupID = this.GroupID;
          this.frmLoanDetails.value.UserID = this.UserID;
          if (this.LoanTypeCode.trim() != "PL") {
            this.isTitle = true;
          }
          else {
            this.isTitle = false;
          }
        }
        else {
          this.isShowModal = 1;
          this.toastr.error(res.m_Item2);
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Oops! Error while getting user loan details.Please try again.");
        this.sharedService.setLoader(false);
      })
    }
    finally {
      //this.sharedService.setLoader(false);
    }
  }

  LoanApprovedStatus(status: string) {
    if (status == "Yes") {
      this.frmLoanDetails.value.IsApproved = 1;
      this.apiManager.postAPI(API.LOANAPPROVED, this.frmLoanDetails.value).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.GetApprovedLoans();
          this.GetPendingLoans();
          this.toastr.success(response.m_Item2);
        }
        else {
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        console.log(err);
        this.toastr.error("Oops! Error while approving loan.Please try again.");
      });
    }
    else if (status == "No") {
      this.closeForm();
      this.frmLoanDetails.value.IsApproved = 2;
      this.apiManager.postAPI(API.LOANAPPROVED, this.frmLoanDetails.value).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          this.isShowModal = 1;
        }
        else {
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        console.log(err);
        this.toastr.error("Oops! Error while approving loan.Please try again.");
      });
    }
  }

  DownloadDocument(rowIndex) {
    this.sharedService.setLoader(true);
    this.selectedLoanDetails = this.loanDocumentdList[rowIndex];
    this.loanEarnsService._getDownloadFile(this.selectedLoanDetails).then((res: any) => {
      if (!res.m_Item1) {
        this.toastr.error(res.Item2);
        this.sharedService.setLoader(false);
        return;
      }
      let FileData = res.m_Item3;
      let fileName = FileData.FileName;

      let fileContent = FileData.FileContent.replace(/\s/g, ''); //IE compatibility...
      let byteCharacters = atob(fileContent);
      let byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        let slice = byteCharacters.slice(offset, offset + 512);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      var splitFile = fileName.split(".");
      this.fileDownloader(byteArrays, splitFile[0] + '.' + splitFile[1], 'application/' + splitFile[1])
      this.sharedService.setLoader(false);
    }, err => {
      this.toastr.error("Oops! Download failed, Please try again.");
      this.sharedService.setLoader(false);
    });
  }

  fileDownloader(documentContent, documentName, contentType) {
    var ieEDGE = navigator.userAgent.match(/Edge/g);
    var ie = navigator.userAgent.match(/.NET/g); // IE 11+
    var oldIE = navigator.userAgent.match(/MSIE/g);

    var blob = new window.Blob(documentContent, { type: contentType });

    if (ie || oldIE || ieEDGE) {

      var fileName = documentName;
      window.navigator.msSaveBlob(blob, fileName);
    }
    else {

      var file = new Blob(documentContent, {
        type: contentType
      });
      var fileURL = URL.createObjectURL(file);

      var fileURL = URL.createObjectURL(file);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
    }
  }

  onSearchChange(searchValue: string) {
    if (!!searchValue && searchValue.trim().length >= 5) {
      this.sharedService.setLoader(true);
      this.getApprovedLoansByDCIDorUserName(searchValue);
      this.getPendingLoansByDCIDorUserName(searchValue);
      this.getRejectedLoansDCIDorUserName(searchValue);
      this.sharedService.setLoader(false);
    }
  }
  getApprovedLoansByDCIDorUserName(searchValue: string) {
    this.loanEarnsService._getApprovedLoansByDCIDorUserName(searchValue).subscribe((res: any) => {

      if (res.m_Item1) {
        this.listOfApprovedLoans = res.m_Item3;
      }
      else {
        this.listOfApprovedLoans = [];
        if(this.listOfApprovedLoans.length===0){
          this.listOfApprovedLoans = undefined;
        }
      }
    }, err => {
      this.listOfApprovedLoans = [];
    })
  }
  getPendingLoansByDCIDorUserName(searchValue: string) {
    this.loanEarnsService._getPendingLoansByDCIDorUserName(searchValue).subscribe((res: any) => {

      if (res.m_Item1) {
        this.listOfPendingLoans = res.m_Item3;
      }
      else {
        this.listOfPendingLoans = [];
        if(this.listOfPendingLoans.length===0){
          this.listOfPendingLoans = undefined;
        }
      }
    }, err => {
      this.listOfPendingLoans = [];
    })
  }
  getRejectedLoansDCIDorUserName(searchValue: string) {
    this.loanEarnsService._getRejectedLoansDCIDorUserName(searchValue).subscribe((res: any) => {

      if (res.m_Item1) {
        this.listOfRejectedLoans = res.m_Item3;
      }
      else {
        this.listOfRejectedLoans = [];
        if(this.listOfRejectedLoans.length===0){
          this.listOfRejectedLoans = undefined;
        }
      }
    }, err => {
      this.listOfRejectedLoans = [];
    })
  }
  getLoanType(loanTypeCode: string) {
    if (loanTypeCode.toUpperCase().trim() == "PL")
      return "Personal Loan";
    else if (loanTypeCode.toUpperCase().trim() == "FR")
      return "Fee Reimbursement";
    else if (loanTypeCode.toUpperCase().trim() == "HB")
      return "Health Benefits";
    else if (loanTypeCode.toUpperCase().trim() == "RB")
      return "Risk Benefit";
    else if (loanTypeCode.toUpperCase().trim() == "HL")
      return "Home Loan";
  }

  getModeofTransfer(ModeofTransfer: number) {
    if (ModeofTransfer == 1)
      return "Check";
    else if (ModeofTransfer == 2)
      return "Cash";
    else if (ModeofTransfer == 3)
      return "DD";
    else if (ModeofTransfer == 4)
      return "A/C Transfer";
  }

  getLoanStatus(LoanStatusID: number) {
    if (LoanStatusID == 1)
      return "Payment Pending";
    else if (LoanStatusID == 2)
      return "Partial Payment done";
    else if (LoanStatusID == 3)
      return "Payment Done";
  }

  IsLoanApproved(isApproved: number) {
    if (isApproved == 0)
      return "Pending";
    else if (isApproved == 1)
      return "Approved";
    else if (isApproved == 3)
      return "Rejected";
  }

  closeForm() {
    this.isShowModal = 1;
  }
}
