import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SharedService } from "../../utility/shared-service/shared.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { BaseComponent } from "../../utility/base-component/base.component";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { API } from "../../utility/constants/api";
import { dialog, slideUp } from "../animation";
import { TranslateService } from "../../utility/translate/translate.service";
import { style, transition, animate, trigger } from "@angular/animations";
import { FranchiseService } from "../../utility/shared-service/franchise.service";
import { CommonService } from '../../utility/shared-service/common.service';
import { BaseUrl } from '../../utility/constants/base-constants';

@Component({
  selector: 'app-franchiserequest',
  templateUrl: './franchiserequest.component.html',
  styleUrls: ['./franchiserequest.component.css'],
  providers: [FranchiseService, CommonService],
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

export class FranchiserequestComponent extends BaseComponent implements OnInit {

  isShowModal: number = 1;
  franchiseRequestForm: FormGroup;
  franchiseApprovedFrom: FormGroup;

  listFranchiseRequestStatus: any;
  listFranchiseUserRequests: any;
  listAllFranchiseRequests: any[];
  gridTitle: string;
  selectedRow: any;
  userID: number;
  roleID: string;
  UserDetails: any;
  public is_Visible_Franchise: boolean = false;
  public is_Visible_Admin: boolean = false;

  constructor(private sharedService: SharedService,
    private franchiseService: FranchiseService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    private commonService: CommonService,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.roleID = this.sharedService.getRoleID();
    this.UserDetails = this.sharedService.getUser();
    this.userID = this.UserDetails.UserID;
    this.GetFranchiseRequestStatus();
    this.createFranchiseRequestForm();
    if (this.roleID === BaseUrl.AdminRoleID) {
      this.is_Visible_Admin = true;
      this.GetAllFranchiseRequests();
    }
    if (this.roleID === BaseUrl.FranchiseRoleID) {
      this.is_Visible_Franchise = true;
      this.GetFranchiseRequestsByUserID(this.userID);
    }
  }

  createFranchiseRequestForm() {
    this.franchiseRequestForm = this.fb.group({
      StatusID: new FormControl('')
    })
  }

  createViewFranchiseRequest() {
    this.franchiseApprovedFrom = this.fb.group({
      ID: new FormControl(''),
      UserName: [''],//Requested By
      UserID: [''],
      StatusID: ['']
    })
  }

  FranchiseRequest() {
    this.createFranchiseRequestForm();
    this.isShowModal = 2;
  }

  AccecptRequest(status: string) {
    if (status == "Yes") {
      this.franchiseRequestForm.patchValue({
        StatusID: 1
      })
      this.apiManager.postAPI(API.SAVEFRANCHISEREQUEST, this.franchiseRequestForm.value).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          this.GetFranchiseRequestsByUserID(this.userID);
          this.isShowModal = 1;
        }
        else {
          this.GetFranchiseRequestsByUserID(this.userID);
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {
        this.toastr.error("Error while franchise request.Please try again.");
      });
    }
    else if (status == "No") {
      this.closeForm();
    }
  }

  public GetFranchiseRequestStatus() {
    this.sharedService.setLoader(true);
    this.commonService._getFranchiseRequestStaus().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listFranchiseRequestStatus = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  GetFranchiseRequestsByUserID(userID) {
    this.sharedService.setLoader(true);
    this.franchiseService._getFranchiseRequestsByUserID(userID).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listFranchiseUserRequests = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  GetAllFranchiseRequests() {
    this.sharedService.setLoader(true);
    this.franchiseService._getAllFranchiseUserRequests().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.listAllFranchiseRequests = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  ViewFranchiseRequest(rowIndex) {
    this.isShowModal = 3;
    this.createViewFranchiseRequest();
    this.selectedRow = this.listAllFranchiseRequests[rowIndex];
    let StatusId = this.selectedRow.StatusID;
    this.franchiseApprovedFrom.patchValue({
      ID: this.selectedRow.ID,
      UserID: this.selectedRow.UserID,
      UserName: this.selectedRow.UserName
    })
    this.franchiseApprovedFrom.controls['StatusID'].setValue(StatusId, { onlySelf: true })
  }

  ApproveFranchiseRequest(frmFranchiseApproved, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.APPROVEFRANCHISEREQUEST, frmFranchiseApproved).subscribe(response => {
        if (response.m_Item1) {
          this.toastr.success(response.m_Item2);
          this.GetAllFranchiseRequests();
          this.isShowModal = 1;
        }
        else {
          this.GetAllFranchiseRequests();
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {
        this.toastr.error("Error while approving franchise request.Please try again.");
      });
    }
    else {
      this.toastr.error("Form is not valid");
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

  closeForm() {
    this.isShowModal = 1;
  }

}
