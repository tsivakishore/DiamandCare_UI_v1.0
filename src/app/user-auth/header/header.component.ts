import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[];

  constructor() { }

  ngOnInit() {
    this.items = [
      { label: 'Home', icon: 'fa fa-home fa-fw', routerLink: ['/home'] },
      { label: 'Institutions Gallery', icon: 'fa fa-home fa-fw', routerLink: ['/sphotogallery'] },
      { label: 'Employees Gallery', icon: 'fa fa-home fa-fw', routerLink: ['/ephotogallery'] },
      { label: 'Loans Flow Chart', icon: 'fa fa-fw fa-book', routerLink: ['/loansflow'] },
      { label: 'Contact Us', icon: 'fa fa-fw fa-book', routerLink: ['/contactus'] },
      { label: 'Register', icon: 'fa fa-user-circle', routerLink: ['/register'] },
      { label: 'Login', icon: 'fa fa-sign-in', routerLink: ['/login'] }
    ];
  }

}
