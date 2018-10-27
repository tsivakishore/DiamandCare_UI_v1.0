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

  images: any[];
  imageToShow: any[] = [];

  constructor(public _DomSanitizationService: DomSanitizer,
    private sharedService: SharedService,
    public schoolService: SchoolService) {

  }

  ngOnInit() {
    //this.getImagesDisplay();
  }

  public getImagesDisplay() {
    this.sharedService.setLoader(true);
    this.images = [];
    this.imageToShow = [];
    this.schoolService._getImagesDisplay('SaradaSchool').subscribe((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.images = res.m_Item3;
        console.log(this.images)
        this.images.map(item => {
          return {
            source: this._DomSanitizationService.bypassSecurityTrustResourceUrl(item.Url),
            alt: item.FileName,
            title: item.InstituteName
          }
        }).forEach(item => this.imageToShow.push(item));
      }
      console.log(this.imageToShow);

    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }

}
