import { Injectable } from "@angular/core";
import { HttpService } from "../../utility/http-service";
import { Observable } from "rxjs";
import { API } from "../../utility/constants/api";
import { Response } from "@angular/http";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

@Injectable()
export class UserService {

    constructor(private httpService: HttpService, private toastManager: ToastsManager) {
    }

    _getUserDetailsByDCIDorName(DCIDorName) {
        return this.httpService
            .get(API.GETUSERDETAILSBYDCIDOrUSERNAME + '?DCIDorName=' + DCIDorName)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _getUserDetailsByUserID(UserID) {
        return this.httpService
            .get(API.GETUSERDETAILSBYUSERID + '?UserID=' + UserID)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _getUserAddressById(Id) {
        return this.httpService
            .get(API.USERADDRESSBYID + '?Id=' + Id)
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