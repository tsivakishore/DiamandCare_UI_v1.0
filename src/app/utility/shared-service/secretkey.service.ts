import { Injectable } from "@angular/core";
import { HttpService } from "../../utility/http-service";
import { Observable } from "rxjs";
import { API } from "../../utility/constants/api";
import { Response } from "@angular/http";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

@Injectable()
export class SecretKeyService {

    constructor(private httpService: HttpService, private toastManager: ToastsManager) {
    }

    _getSecretKey() {
        return this.httpService
            .get(API.GETSECRETKEYS)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }
    _getSecretKeyByUserID() {
        return this.httpService
            .get(API.GETSECRETKEYSBYUserID)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _getUsernameWalletMasterChargesByDCIDorName(postData) {
        return this.httpService
            .get(API.GETUSERNAMEWALLETMASTERCHARGESBYDCIDorNAME + '?DcIDorName=' + postData)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _getUserWalletMasterCharges(postData) {
        return this.httpService
            .get(API.GETUSERWALLETMASTERCHARGES + '?DcIDorName=' + postData)
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