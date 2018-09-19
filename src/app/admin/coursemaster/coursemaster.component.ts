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
import { CoursemasterService } from "../../utility/shared-service/coursemaster.service";

@Component({
  selector: 'app-coursemaster',
  templateUrl: './coursemaster.component.html',
  styleUrls: ['./coursemaster.component.css'],
  providers: [CoursemasterService],
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

export class CoursemasterComponent extends BaseComponent implements OnInit {

  frmCourseMaster: FormGroup;
  frmCourse: FormGroup;
  Username: any;
  lstCourseMaster: any;
  lstCourse: any;
  isShowModal: number = 1;
  selectedRow: any;
  actiontype: string;
  courseMasterID: number;

  constructor(private sharedService: SharedService,
    private coursemasterService: CoursemasterService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.createCourseMasterForm();
    this.getCourseMaster();
  }

  createCourseMasterForm() {
    this.frmCourseMaster = this.fb.group({
      CourseMasterID: [''],
      CourseMasterName: ['', Validators.compose([Validators.required])],
      CourseDescription: ['', Validators.compose([Validators.required])],
    })
  }

  createCourseForm() {
    this.frmCourse = this.fb.group({
      CourseMasterID: [''],
      CourseID: [''],
      CourseName: ['', Validators.compose([Validators.required])],
      CourseDescription: ['', Validators.compose([Validators.required])],
    })
  }

  EditCourseMaster(rowData: any) {
    this.isShowModal = 2;
    this.createCourseMasterForm();
    this.actiontype = "Edit Course Master";
    this.frmCourseMaster.patchValue({
      CourseMasterID: rowData.CourseMasterID,
      CourseMasterName: rowData.CourseMasterName,
      CourseDescription: rowData.CourseDescription
    })
  }

  ViewCourseMasterModel() {
    this.isShowModal = 2;
    this.actiontype = "Add Course Master";
    this.createCourseMasterForm();
  }

  ViewCourseModel() {
    this.isShowModal = 3;
    this.actiontype = "Add Course";
    this.createCourseForm();
    this.frmCourse.patchValue({
      CourseMasterID: this.courseMasterID
    })
  }

  EditCourse(rowData: any) {
    this.isShowModal = 3;
    this.createCourseForm();
    this.actiontype = "Edit Course";
    this.frmCourse.patchValue({
      CourseID: rowData.CourseID,
      CourseMasterID: rowData.CourseMasterID,
      CourseName: rowData.CourseName,
      CourseDescription: rowData.CourseDescription
    })
  }

  CreateCourseMaster(formCourseMaster, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.CREATECOURSEMASTER, formCourseMaster).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.frmCourseMaster.reset();
          this.getCourseMaster();
        }
        else {
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Oops! There has been an error while create course master.Please try again.");
      });
    }
    else {
      this.toastr.error("Form is not valid");
    }
  }

  CreateCourse(formCourse, isValidForm) {
    if (isValidForm) {
      this.apiManager.postAPI(API.CREATECOURSE, formCourse).subscribe(response => {
        if (response.m_Item1) {
          this.isShowModal = 1;
          this.toastr.success(response.m_Item2);
          this.frmCourse.reset();
          this.getCourseDetailsByMasterCourseID(this.courseMasterID)
        }
        else {
          this.toastr.error(response.m_Item2);
          this.isShowModal = 1;
        }
      }, err => {
        this.isShowModal = 1;
        this.toastr.error("Oops! There has been an error while create course.Please try again.");
      });
    }
    else {
      this.toastr.error("Form is not valid");
    }
  }

  getCourseDetails(chileTableData: any) {
    this.sharedService.setLoader(true);
    this.lstCourse = [];
    this.courseMasterID = chileTableData.data.CourseMasterID;
    this.coursemasterService._getCourseDetailsByID(this.courseMasterID).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstCourse = res.m_Item3;
        console.log(this.lstCourse)
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  getCourseDetailsByMasterCourseID(courseMasterID: number) {
    this.sharedService.setLoader(true);
    this.lstCourse = [];
    this.coursemasterService._getCourseDetailsByID(courseMasterID).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstCourse = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  public getCourseMaster() {
    this.sharedService.setLoader(true);
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

  restrictSpace(e) {
    //restrict Space
    var startPos = e.currentTarget.selectionStart;
    if (e.which === 32 && startPos == 0)
      e.preventDefault();
  }

  closeForm() {
    this.isShowModal = 1;
  }

}
