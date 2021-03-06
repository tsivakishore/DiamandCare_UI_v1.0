import { Injectable } from "@angular/core";
import { HttpService } from "../../utility/http-service";
import { Observable } from "rxjs";
import { API } from "../../utility/constants/api";
import { Response } from "@angular/http";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { SharedService } from '../../utility/shared-service/shared.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DisplayScreensService {

  constructor(private httpService: HttpService,
    private http: HttpClient,
    private sharedService: SharedService,
    private toastManager: ToastsManager) {
  }

  _getScreenMasterDetails() {
    return this.httpService
      .get(API.GETSCREENMASTERDETAILS)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }
  
  _getRoleMenusByScreenID(postData) {
    return this.httpService
      .get(API.GETROLEMENUDETAILSBYSCREENID + '?screenID=' + postData)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  _deleteRoleMenuMap(postData) {
    return this.httpService
      .get(API.DELETEROLEMENU + '?ID=' + postData)
      .map(res => this.extractData(res, true)).catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  private extractData(res: Response, show?: boolean) {
    let data = res.json();
    let msg = data.message;
    if (show && msg) {
      this.toastManager.success(msg);
    }
    return data || {};
  }

}
