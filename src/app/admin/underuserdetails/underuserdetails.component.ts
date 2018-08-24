import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { SharedService } from "../../utility/shared-service/shared.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { BaseComponent } from "../../utility/base-component/base.component";
import { APIManager } from "../../utility/shared-service/apimanager.service";
import { TranslateService } from "../../utility/translate/translate.service";
import { TreeViewDataService } from "../../utility/shared-service/treeviewdata.service";

@Component({
  selector: 'app-underuserdetails',
  templateUrl: './underuserdetails.component.html',
  styleUrls: ['./underuserdetails.component.css'],
  providers: [TreeViewDataService]
})
export class UnderuserdetailsComponent extends BaseComponent implements OnInit {

  lstTreeData: any;
  userID: number;
  UserDetails: any;

  constructor(private sharedService: SharedService,
    private treeViewDataService: TreeViewDataService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef,
    public translateService: TranslateService) {
    super(toastr, vcr);
  }

  ngOnInit() {
    this.UserDetails = this.sharedService.getUser();
    this.userID = this.UserDetails.UserID;
    this.getTreeViewData(this.userID);
  }

  public getTreeViewData(userID: number) {
    this.sharedService.setLoader(true);
    this.treeViewDataService._getTreeViewData(userID).then((res: any) => {
      this.sharedService.setLoader(false);
      if (res.m_Item1) {
        this.lstTreeData = res.m_Item3;
      }
    }, err => {
      console.log(err);
      this.sharedService.setLoader(false);
    })
  }
}
