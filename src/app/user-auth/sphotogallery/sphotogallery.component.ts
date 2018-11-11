import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SchoolService } from '../../utility/shared-service/school.service';
import { SharedService } from "../../utility/shared-service/shared.service";

@Component({
  selector: 'app-sphotogallery',
  templateUrl: './sphotogallery.component.html',
  styleUrls: ['./sphotogallery.component.css'],
  providers: [SchoolService]
})

export class SphotogalleryComponent implements OnInit {
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
    this.getImagesDisplay(this.defaultSchoolName);
  }

  // public getImagesDisplay(schoolName: string) {
  //   this.sharedService.setLoader(true);
  //   this.images = [];
  //   this.imageToShow = [];
  //   this.schoolService._getImagesDisplay(schoolName).subscribe((res: any) => {
  //     this.sharedService.setLoader(false);
  //     if (res.m_Item1) {
  //       this.images = res.m_Item3;
  //       this.imgCount = this.images.length;
  //       this.images.map(item => {
  //         return {
  //           source: this._DomSanitizationService.bypassSecurityTrustResourceUrl(item.ImageUrl),
  //           alt: item.Description,
  //           title: item.SchoolName
  //         }
  //       }).forEach(item => this.imageToShow.push(item));
  //     }
  //     this.noImgCount = this.imageToShow.length;
  //   }, err => {
  //     console.log(err);
  //     this.sharedService.setLoader(false);
  //   })
  // }

  public getImagesDisplay(schoolName: string) {
    this.sharedService.setLoader(true);
    this.images = [];
    this.imageToShow = [];
    this.schoolService._getImagesDisplay(schoolName).subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.images = res.m_Item3;
        this.imgCount = this.images.length;
        this.images.map(item => {
          return {
            source: this._DomSanitizationService.bypassSecurityTrustResourceUrl(item.ImageUrl),
            alt: item.Description,
            title: item.SchoolName
          }
        }).forEach(item => this.imageToShow.push(item));
      }
      this.noImgCount = this.imageToShow.length;
      console.log(this.imageToShow);
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

  formImgSrc(url: any) {
    return url;
  }

}
