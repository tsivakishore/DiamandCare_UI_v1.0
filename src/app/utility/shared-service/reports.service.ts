import { Injectable } from "@angular/core";
import { HttpService } from "../../utility/http-service";
import { Observable } from "rxjs";
import { API } from "../../utility/constants/api";
import { Response } from "@angular/http";
import { ToastsManager } from "ng2-toastr/ng2-toastr";
import { SharedService } from '../../utility/shared-service/shared.service';
import { AppConstant, BaseUrl } from '../../utility/constants/base-constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ReportsService {

    constructor(private httpService: HttpService,
        private http: HttpClient,
        private sharedService: SharedService,
        private toastManager: ToastsManager) {
    }

    _getgetReportTypes(postData) {
        return this.httpService
            .get(API.GETREPORTTYPES + '?LoginType=' + postData)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _getSharedSecretKeyByUserID() {
        return this.httpService
            .get(API.GETSECRETKEYSBYUserID)
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
