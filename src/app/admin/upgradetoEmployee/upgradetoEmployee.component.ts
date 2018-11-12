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
import { EmployeeService } from '../../utility/shared-service/employee.service';
import { UpgradetoemployeeService } from '../../utility/shared-service/Upgradetoemployee.service';

@Component({
  selector: 'app-upgradetoEmployee',
  templateUrl: './upgradetoEmployee.component.html',
  styleUrls: ['./upgradetoEmployee.component.css'],
  providers: [FranchiseService, EmployeeService, UpgradetoemployeeService],
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
export class UpgradetoEmployeeComponent extends BaseComponent implements OnInit {
  frmUpgradeToEmployee: FormGroup;
  lstEmployees: any;
  Username: any;
  UnderEmployeesList: any;
  upgradeEmployees: any;
  employeesList: any = [];
  userID: number;
  isShowModal: number = 1;
  selectedRow: any;
  update: boolean = false;

  constructor(private sharedService: SharedService,
    private upgradetoemployeeService: UpgradetoemployeeService,
    private apiManager: APIManager,
    private franchiseService: FranchiseService,
    private employeeService: EmployeeService,
    public toastr: ToastsManager,
    private fb: FormBuilder,
    public vcr: ViewContainerRef, ) { super(toastr, vcr); }

  ngOnInit() {
    this.createUpgradeEmployeeForm();
    this.getEmployeeMasterDetails();
    this.getUpgradeEmployees();
  }

  createUpgradeEmployeeForm() {
    this.frmUpgradeToEmployee = this.fb.group({
      ID: [''],
      UserID: [''],
      UserNameOrID: ['', [Validators.required]],
      UserName: ['', Validators.compose([Validators.required])],
      DesignationID: [''],
      UnderEmployeeID: [null],
      ConditionsApplySelf: [''],
      ConditionsApplyGroup: [''],
      RecruitmentReq: [''],
      RegIncentive: [''],
      LoanPayIncentive: [''],
      TargetJoineesPerMonth: [''],
      Salary: [''],
      Description: ['']
    })
  }


  // Get UserName by UserID or UserName
  onUsernameByDCIDorName(DcIDorName: any) {

    DcIDorName = DcIDorName.UserNameOrID;
    if (DcIDorName != "") {
      this.franchiseService._getUsernameByDCIDorName(DcIDorName).subscribe(response => {
        if (response.m_Item1) {
          this.userID = response.m_Item3.UserID
          this.frmUpgradeToEmployee.patchValue({
            UserName: response.m_Item3.UserName
          })
        }
        else {
          this.frmUpgradeToEmployee.patchValue({
            UserName: '',
            UserID: ''
          })
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.toastr.error("Oops! There has been an error from server. Please try again.");
      })
    }
  }

  public getEmployeeMasterDetails() {
    this.employeeService._getEmployeeMasterDetails().subscribe((res: any) => {
      if (res.m_Item1) {
        this.lstEmployees = res.m_Item3;
        res.m_Item3.forEach(e => {
          var temp = {
            'ID': e.ID, 'Description': e.Description, 'Designation': e.Designation, 'LoanPayIncentive': e.LoanRePayIncentive,
            'RecruitmentReq': e.RecruitmentsReq, 'RegIncentive': e.RegIncentive, 'Salary': e.Salary, 'TargetJoineesPerMonth': e.TargetJoineesPerMonth
          }
          this.employeesList.push(temp);
        });
      }
    }, err => {
      console.log(err);
    })
  }

  // Get values selected on Designation
  public getUnderEmployeeDetails(designation: any) {
    this.UnderEmployeesList = [];
    this.sharedService.setLoader(true);
    this.upgradetoemployeeService._getUnderEmployees(designation).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.UnderEmployeesList = res.m_Item3;
      }
      else {
        this.toastr.error(res.m_Item2);
      }
    }, err => {
      this.sharedService.setLoader(false);
      console.log(err);
    })
    var singlevalue = this.employeesList.find(item => item.ID == designation);
    this.bindValuestoFormGroup(singlevalue);
  }

  bindValuestoFormGroup(values: any) {
    this.frmUpgradeToEmployee.patchValue({
      RecruitmentReq: values.RecruitmentReq,
      RegIncentive: values.RegIncentive,
      LoanPayIncentive: values.LoanPayIncentive,
      TargetJoineesPerMonth: values.TargetJoineesPerMonth,
      Salary: values.Salary,
      Description: ''
    })
  }

  public InsertOrUpdateEmployee(formUpgradeToEmployee, isValidForm) {
    if (isValidForm) {  //InsertEmployee
      if (!this.update) {
        formUpgradeToEmployee.UserID = this.userID;
        this.apiManager.postAPI(API.INSERTORUPDATEUPGRADEEMPLOYEE, formUpgradeToEmployee).subscribe(response => {
          if (response.m_Item1) {
            this.frmUpgradeToEmployee.reset();
            this.toastr.success(response.m_Item2);
            this.getUpgradeEmployees();
          }
          else
            this.toastr.error(response.m_Item2);
        }, err => {
          console.log(err);
          this.toastr.error("Error while upgrade Employee. Please try again.");
        });
      }
      else { //UpdateEmployee
        this.apiManager.postAPI(API.INSERTORUPDATEUPGRADEEMPLOYEE, formUpgradeToEmployee).subscribe(response => {
          if (response.m_Item1) {
            this.frmUpgradeToEmployee.reset();
            this.toastr.success('Upgrade Employee updated successfully');
            this.update = false;
            this.cancelUpgradeEmployee();
            this.getUpgradeEmployees();
          }
          else
            this.toastr.error(response.m_Item2);
        }, err => {
          console.log(err);
          this.toastr.error("Error while upgrade Employee. Please try again.");
        });
      }

    }
  }

  public getUpgradeEmployees() {
    this.sharedService.setLoader(true);
    this.upgradetoemployeeService._getUpgradeToEmployees().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.upgradeEmployees = res.m_Item3;
      }
      else {
        this.toastr.error(res.m_Item2);
      }
    }, err => {
      this.sharedService.setLoader(false);
      console.log(err);
    })
  }

  editUpgradeEmployee(data: any) {
    this.isShowModal = 2;
    this.update = true;
    // this.frmUpgradeToEmployee.get("UserNameOrID").clearValidators();
    // this.frmUpgradeToEmployee.get("UserName").clearValidators();
    this.frmUpgradeToEmployee.get('UserNameOrID').disable();
    this.getUnderEmployeeDetails(data.DesignationID)
    this.frmUpgradeToEmployee.patchValue(data)
    this.frmUpgradeToEmployee.controls['UserNameOrID'].setValue(data.UserID);
    this.frmUpgradeToEmployee.get('UserName').disable();
  }

  cancelUpgradeEmployee() {
    this.isShowModal = 1;
    this.frmUpgradeToEmployee.get('UserNameOrID').enable();
    this.frmUpgradeToEmployee.get('UserName').enable();
    this.createUpgradeEmployeeForm();
    this.getEmployeeMasterDetails();
    this.UnderEmployeesList = [];
  }
}
