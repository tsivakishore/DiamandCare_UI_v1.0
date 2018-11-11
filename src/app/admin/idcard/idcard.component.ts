import { Component, HostListener, OnInit, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { UserAuthService } from "../../user-auth/user-auth.service";
import { style, transition, animate, trigger } from "@angular/animations";
import { slideUp } from "../animation";
import { BaseComponent } from "../../utility/base-component/base.component";
import { ToastsManager } from "ng2-toastr";
import {
  DomSanitizer,
  SafeHtml,
  SafeUrl,
  SafeStyle
} from "@angular/platform-browser";
import * as jspdf from 'jspdf'; 
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-idcard',
  templateUrl: './idcard.component.html',
  styleUrls: ['./idcard.component.css'],
  providers: [UserAuthService],
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
export class IdcardComponent extends BaseComponent implements OnInit {

  data:any;
  imgSrc: any;
  name:any;
  userName:any;
  designation:any;
  dcid:any;
  userAddress:any;
  phone:any;

  constructor(
    private userAuthService: UserAuthService,
    public vcr: ViewContainerRef,
    private toastManager: ToastsManager,
    private sanitizer:DomSanitizer
    ) {
    super(toastManager, vcr);
    this.getUserIdCardDetails();
  }

  elementType: 'url' | 'canvas' | 'img' = 'url';  

  ngOnInit() {
    //this.getUserIdCardDetails();
  }

  public getUserIdCardDetails() {
    this.userAuthService._getUserIdCardDetails().subscribe((res: any) => {
      if (res.m_Item1) {
        this.data = res.m_Item3;
        if(!!this.data){
          this.name=this.data.FirstName+' '+this.data.LastName;
          this.userName=this.data.UserName;
          this.designation=this.data.Designation;
          this.dcid=this.data.DcID;
          this.userAddress=this.data.UserAddress;
          this.phone=this.data.PhoneNumber
          this.imgSrc = this.formImgSrc(this.data.Photo, "name")
        }
        
      }
      else {
        //this.toastr.error(res.m_Item2);
      }
    }, err => {
      console.log(err);
    })
  }

  formImgSrc(imageContent: any, imageName: string) {
    var splitFile = imageName.split(".");
    let imgType = "data:image/" + splitFile[1] + ";base64,"
    return  this.sanitizer.bypassSecurityTrustResourceUrl(imgType + imageContent);
  }

  public downloadPDF() {
    return xepOnline.Formatter.Format('divEmpidCard', { render: 'download' });
  }

  public captureScreen()  
  {  
    var data = document.getElementById('idCard');  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });  
  }  

}
