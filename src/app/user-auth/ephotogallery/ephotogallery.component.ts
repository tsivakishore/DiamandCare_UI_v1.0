import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SchoolService } from '../../utility/shared-service/school.service';
import { SharedService } from "../../utility/shared-service/shared.service";

@Component({
  selector: 'app-ephotogallery',
  templateUrl: './ephotogallery.component.html',
  styleUrls: ['./ephotogallery.component.css'],
  providers: [SchoolService]
})

export class EphotogalleryComponent implements OnInit {

  defaultSchoolName: string = '';
  imgCount = 0;
  noImgCount: number;

  images: any[];
  imageToShow: any[] = [];

  constructor(public _DomSanitizationService: DomSanitizer,
    private sharedService: SharedService,
    public schoolService: SchoolService) {
  }

  ngOnInit() {
    this.noImgCount = 0;
    this.getEmpPhotosDisplay();
  }

  public getEmpPhotosDisplay() {
    this.sharedService.setLoader(true);
    this.images = [];
    this.imageToShow = [];
    this.schoolService._getEmpPhotosDisplay().subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.images = res.m_Item3;
        this.imgCount = this.images.length;
        console.log(this.imgCount);
      }
      this.noImgCount = this.imageToShow.length;

    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  formImgSrc(ImageFileContent: any, ImageFileName: string) {
    var splitFile = ImageFileName.split(".");
    let imgType = "data:image/" + splitFile[1] + ";base64,"
    return imgType + ImageFileContent;
  }

}
