import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { API } from "../../utility/constants/api";
import { ToastsManager } from "ng2-toastr";
import { BaseComponent } from "../../utility/base-component/base.component";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-uploadInstImages',
  templateUrl: './uploadInstImages.component.html',
  styleUrls: ['./uploadInstImages.component.css']
})
export class UploadInstImagesComponent extends BaseComponent implements OnInit {

  uploadedFiles: any[] = [];
  frmImageUpload: FormGroup;

  constructor(private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    private fb: FormBuilder) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.createImageUploadForm();
  }

  createImageUploadForm() {
    this.frmImageUpload = this.fb.group({
      UserID: [''],
      InstituteID: [''],
      InstituteName: [''],
      FileName: [null]
    })
  }

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  myUploader(event): void {
    if (event.files.length == 0) {
      this.toastr.error("Oops! No file selected.Please try again.");
      return;
    }

    var fileToUpload = event.files;
    this.frmImageUpload.patchValue({
      UserID: 57,
      InstituteID: 1,
      InstituteName: "SaradaSchool"
    })

    this.apiManager.postAPIModified(API.UPLOADIMAGES, this.frmImageUpload.value, fileToUpload).subscribe(response => {
      if (response.m_Item1) {
        this.toastr.success(response.m_Item2);
      }
      else {
        this.toastr.error(response.m_Item2);
      }
    }, err => {
      this.toastr.error("Oops! There has been an error while applying fee reimbursement.Please try again.");
    });
  }
}
