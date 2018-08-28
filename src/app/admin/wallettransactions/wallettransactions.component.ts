import { RoleService } from '../../utility/shared-service/role.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { style, transition, animate, trigger } from "@angular/animations";
import { dialog, slideUp } from "../animation";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { BaseComponent } from "../../utility/base-component/base.component";
import { ToastsManager } from "ng2-toastr";
import { SharedService } from "../../utility/shared-service/shared.service";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { API } from "../../utility/constants/api";
import { WalletService } from '../../utility/shared-service/wallet.service';
import { CommonRegexp } from "../../utility/constants/validations";
import { FranchiseService } from "../../utility/shared-service/franchise.service";

@Component({
  selector: 'app-wallettransactions',
  templateUrl: './wallettransactions.component.html',
  styleUrls: ['./wallettransactions.component.css'],
  providers: [WalletService,FranchiseService],
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
export class WallettransactionsComponent extends BaseComponent implements OnInit {
  WalletExpensesList: any[]
  FundsRequestList: any[]
  isShowModal: number = 1;
  fdFundRequest: FormGroup;
  selectedRow: any;
  lstFranchise: any;
  allFndRqstList:any;
  originalallRolesList: any;

  constructor(private fb: FormBuilder, private walletServ: WalletService, private sharedService: SharedService,
    public toastr: ToastsManager, private apiManager: APIManager,
    private franchiseService: FranchiseService,
    public vcr: ViewContainerRef, ) { super(toastr, vcr); }

  ngOnInit() {
    this.getWalletTransactions();
    this.getFranchiseMasterDetails();
    this.getFundRequestStatus();
  }
  
  public getWalletTransactions() {
    this.sharedService.setLoader(true);
    this.walletServ._getWalletTransactions().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.WalletExpensesList = res.m_Item3;
      }
    }, err => {
      this.sharedService.setLoader(false);
    })
  }

  createFranchiseForm() {
    this.fdFundRequest = this.fb.group({
      ID: new FormControl(''),
      RequestedAmount: ['', Validators.compose([Validators.required])],
      RequestToUserID: new FormControl(''),
      RequestStatusID: new FormControl('')
    })
  }

  EditFranchise(rowIndex) {
    this.isShowModal = 2;
    this.createFranchiseForm();
    this.selectedRow = this.FundsRequestList[rowIndex];
    this.fdFundRequest.patchValue({
      ID: this.selectedRow.ID,
      RequestedAmount: this.selectedRow.RequestedAmount,
      RequestToUserID: this.selectedRow.RequestToUserID,
      RequestStatusID: this.selectedRow.RequestStatusID
    })
  }

  public getFranchiseMasterDetails() {
    this.sharedService.setLoader(true);
    this.walletServ._getFundrequest().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.FundsRequestList = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  onEditFranchise(frmdata: any, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.EDITFRANCHISE, frmdata).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.fdFundRequest.reset();
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

  public getFundRequestStatus() {
    this.allFndRqstList = [];
    if (!this.originalallRolesList) {
      this.walletServ._getFundrequestStatus().subscribe((res: any) => {
        if (res.m_Item1) {
          this.originalallRolesList = res.m_Item3;
          this.allFndRqstList.push({ label: '--Select Role--', value: { RoleID: '', label: '--Select Role--' } });
          this.originalallRolesList.map(o => {
            this.allFndRqstList.push({ label: o.Status, value: { StatusID: o.StatusID, label: o.Status } });
          });
        }
      })
    }
    else {
      this.allFndRqstList.push({ label: '--Select Role--', value: { StatusID: '', label: '--Select Role--' } });
      this.originalallRolesList.map(o => {
        this.allFndRqstList.push({ label: o.Status, value: { StatusID: o.StatusID, label: o.Status } });
      });
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
}
