import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { API } from "../../utility/constants/api";
import { ToastsManager } from "ng2-toastr";
import { BaseComponent } from "../../utility/base-component/base.component";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { style, transition, animate, trigger } from "@angular/animations";
import { dialog, slideUp } from "../animation";
import { SharedService } from "../../utility/shared-service/shared.service";
import { SchoolService } from '../../utility/shared-service/school.service';

@Component({
  selector: 'app-uploadInstImages',
  templateUrl: './uploadInstImages.component.html',
  styleUrls: ['./uploadInstImages.component.css'],
  providers: [SchoolService],
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

export class UploadInstImagesComponent extends BaseComponent implements OnInit {
  @ViewChild('txtSearcByLoanId') txtSearcByLoanId: ElementRef;
  @ViewChild('txtUserName') txtUserName: ElementRef;
  @ViewChild('txtDescription') txtDescription: ElementRef;
  uploadedFiles: any[] = [];
  frmImageUpload: FormGroup;
  schoolDetails: any;
  isShowUpload = false;
  isErrorMessage = false;
  ErrorMessage = '';

  constructor(private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    private sharedService: SharedService,
    private schoolService: SchoolService,
    private fb: FormBuilder) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.createImageUploadForm();
  }

  createImageUploadForm() {
    this.frmImageUpload = this.fb.group({
      UserID: ['', [Validators.required]],
      FileName: [null],
      Description: ['']
    })
  }

  onUpload(event) {
    debugger;
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  myUploader(event, fileUpload): void {
    if (event.files.length == 0) {
      this.toastr.error("Oops! No file selected.Please try again.");
      return;
    }
    debugger;
    this.frmImageUpload.patchValue({
      Description: this.txtDescription.nativeElement.value
    })

    var fileToUpload = event.files;
    this.apiManager.postAPIModified(API.UPLOADIMAGES, this.frmImageUpload.value, fileToUpload).subscribe(response => {
      this.txtDescription.nativeElement.value;
      if (response.m_Item1) {
        this.toastr.success(response.m_Item2);
        fileUpload.clear();
        this.txtUserName.nativeElement.value = '';
        this.txtSearcByLoanId.nativeElement.value = '';
        this.txtDescription.nativeElement.value = '';
        this.isShowUpload = false;
      }
      else {
        this.toastr.error(response.m_Item2);
      }
    }, err => {
      this.toastr.error("Oops! There has been an error while uploading images.Please try again.");
    });
  }

  onSearchChange(searchValue: string) {
    if (!!searchValue && searchValue.trim().length >= 5) {
      this.getSchoolDetailsByDCIDorUserName(searchValue);
    }
  }

  onChangeDescription(searchValue: string) {
    this.ErrorMessage = '';

    if (!!searchValue && searchValue.trim().length >= 5 && searchValue.trim().length < 20) {
      this.isShowUpload = true;
      this.isErrorMessage = false;
    }
    else {
      this.ErrorMessage = 'Enter min of 5 chars and max of 20 chars';
      this.isShowUpload = false;
      this.isErrorMessage = true;
    }

    if (!!this.txtUserName.nativeElement.value && !!this.txtDescription.nativeElement.value)
      this.isShowUpload = true;
    else
      this.isShowUpload = false;

  }

  onFocusDescription(searchValue: string) {
    this.ErrorMessage = '';
    if (!!searchValue) {
      this.isShowUpload = true;
      this.isErrorMessage = false;
    }
    else {
      this.ErrorMessage = 'Description required';
      this.isShowUpload = false;
      this.isErrorMessage = true;
    }
  }

  getSchoolDetailsByDCIDorUserName(searchValue: string) {
    this.schoolService._getSchoolDetailsByDCIDorUserName(searchValue).subscribe((res: any) => {
      if (res.m_Item1) {
        this.schoolDetails = res.m_Item3;
        this.frmImageUpload.patchValue({
          UserID: this.schoolDetails.UserID
        })
        this.txtUserName.nativeElement.value = this.schoolDetails.UserName;
      }
      else {
        this.frmImageUpload.patchValue({
          UserID: ''
        })
        this.txtUserName.nativeElement.value = '';
      }
    }, err => {
      console.log(err);
    })
        
    if (!!this.txtUserName.nativeElement.value && !!this.txtDescription.nativeElement.value)
      this.isShowUpload = true;
    else
      this.isShowUpload = false;
  }

  restrictSpace(e) {
    var startPos = e.currentTarget.selectionStart;
    if (e.which === 32 && startPos == 0)
      e.preventDefault();
  }

}
