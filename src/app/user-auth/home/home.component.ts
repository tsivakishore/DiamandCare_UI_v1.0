import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { slideUp, dialog } from "../../admin/animation";
import { style, transition, animate, trigger } from "@angular/animations";
import { LoanEarnsService } from "../../utility/shared-service/loanEarns.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [LoanEarnsService],
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

export class HomeComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {

  }

}
