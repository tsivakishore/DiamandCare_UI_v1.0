import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { SharedService } from "../../../utility/shared-service/shared.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastsManager } from "ng2-toastr";
import { BaseComponent } from "../../../utility/base-component/base.component";
import { APIManager } from "../../../utility/shared-service/apimanager.service";
import { TreeViewDataService } from "../../../utility/shared-service/treeviewdata.service";

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.css']
})
export class TreeviewComponent extends BaseComponent implements OnInit {

  @Input() lstTreeData: any;

  constructor(private sharedService: SharedService,
    private treeViewDataService: TreeViewDataService,
    private fb: FormBuilder,
    private apiManager: APIManager,
    public toastr: ToastsManager,
    public vcr: ViewContainerRef
  ) {
    super(toastr, vcr);
  }

  ngOnInit() {
  }

  public getUnderUserDetails(userID: number) {
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
