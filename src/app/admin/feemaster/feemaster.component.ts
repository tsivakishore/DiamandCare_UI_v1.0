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
import { FeemasterService } from "../../utility/shared-service/feemaster.service";
import { CoursemasterService } from "../../utility/shared-service/coursemaster.service";

@Component({
  selector: 'app-feemaster',
  templateUrl: './feemaster.component.html',
  styleUrls: ['./feemaster.component.css'],
  providers: [FeemasterService, CoursemasterService],
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

export class FeemasterComponent extends BaseComponent implements OnInit {

  isController = true;
  frmFeeMaster: FormGroup;
  UserDetails: any;
  lstFeeMaster: any;
  lstCourses: any;
  lstCourseMaster: any;
  isShowModal: number = 1;
  selectedRow: any;
  actiontype: string;
  UserID: number;

  constructor(private sharedService: SharedService,
    private feemasterService: FeemasterService,
    private coursemasterService: CoursemasterService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.UserDetails = this.sharedService.getUser();
    this.UserID = this.UserDetails.UserID;
    this.getFeeMasterDetails(this.UserID);
  }

  createFeeMasterForm() {
    this.frmFeeMaster = this.fb.group({
      FeeMasterID: new FormControl(''),
      UserID: new FormControl(''),
      CourseMasterID: new FormControl(null, Validators.compose([Validators.required])),
      CourseID: new FormControl(null, Validators.compose([Validators.required])),
      CourseFee: new FormControl('', Validators.compose([Validators.required, Validators.pattern(CommonRegexp.NUMERIC_REGEXP)]))
    })
  }

  ViewFeeMasterModel() {
    this.lstCourses = [];
    this.lstCourseMaster = [];
    this.isShowModal = 2;
    this.actiontype = "Add Fee Master";
    this.createFeeMasterForm();
    this.getCourseMstaers();
    this.frmFeeMaster.controls["CourseMasterID"].setValue(null, { onlySelf: true })
  }

  getCourses(courseMasterID: number) {
    this.sharedService.setLoader(true);
    this.lstCourses = [];
    this.coursemasterService._getCourseDetailsByID(courseMasterID).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstCourses = res.m_Item3;
      }
      else {
        this.toastr.error("Oops! " + res.m_Item2 + " for this course master");
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  getCourseMstaers() {
    this.sharedService.setLoader(true);
    this.lstCourseMaster = [];
    this.coursemasterService._getCourseMasterDetails().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstCourseMaster = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  getFeeMasterDetails(UserID: number) {
    this.sharedService.setLoader(true);
    this.lstFeeMaster = [];
    this.feemasterService._getFeeMasterDetails(UserID).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstFeeMaster = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  CreateFeeMaster(formFeeMaster, isValidForm) {
    if (isValidForm) {
      formFeeMaster.UserID = this.UserID;
      this.apiManager.postAPI(API.CREATEFEEMASTER, formFeeMaster).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.frmFeeMaster.reset();
          this.getFeeMasterDetails(this.UserID);
        }
        else {
          this.toastr.error(response.m_Item2);
        }
      }, err => {
        this.toastr.error("Oops! There has been an error while create fee master.Please try again.");
      });
    }
    else {
      this.toastr.error("Form is not valid");
    }
  }

  EditFeeMaster(rowData: any) {
    this.isShowModal = 2;
    this.createFeeMasterForm();
    this.getCourseMstaers();
    this.getCourses(rowData.CourseMasterID);
    this.actiontype = "Edit Course";
    this.frmFeeMaster.patchValue({
      FeeMasterID: rowData.FeeMasterID,
      UserID: rowData.UserID,
      CourseFee: rowData.CourseFee
    })
    
    this.frmFeeMaster.controls["CourseMasterID"].setValue(rowData.CourseMasterID, { onlySelf: true });
    this.frmFeeMaster.controls["CourseID"].setValue(rowData.CourseID, { onlySelf: true });
  }

  filterCourseMaster(courseMasterID: any) {
    if (courseMasterID != null) {
      this.getCourses(parseInt(courseMasterID));
      this.frmFeeMaster.controls["CourseID"].setValue(null, { onlySelf: true })
    }
  }

  filterCourse(selectedValue: any) {
    if (selectedValue != null) {
      this.frmFeeMaster.get('CourseID').clearValidators();
    }
    else {
      this.frmFeeMaster.controls['CourseID'].setValidators(Validators.compose([Validators.required]));
      this.frmFeeMaster.get('CourseID').updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
  }

  restrictSpace(e) {
    //restrict Space
    var startPos = e.currentTarget.selectionStart;
    if (e.which === 32)
      e.preventDefault();
  }

  closeForm() {
    this.isShowModal = 1;
  }
}
