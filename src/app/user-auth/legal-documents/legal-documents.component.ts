import { Component, OnInit } from '@angular/core';
import { slideUp, dialog } from "../../admin/animation";
import { style, transition, animate, trigger } from "@angular/animations";

@Component({
  selector: 'app-legal-documents',
  templateUrl: './legal-documents.component.html',
  styleUrls: ['./legal-documents.component.css'],
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

export class LegalDocumentsComponent implements OnInit {
  isShowCertificate = false;
  isShowPanCard = false;
  constructor() { }

  ngOnInit() {
    this.isShowCertificate = true;
    this.isShowPanCard = false;
  }

  onShowCertificate() {
    this.isShowCertificate = true;
    this.isShowPanCard = false;
  }

  onShowPanCard() {
    this.isShowCertificate = false;
    this.isShowPanCard = true;
  }
}
