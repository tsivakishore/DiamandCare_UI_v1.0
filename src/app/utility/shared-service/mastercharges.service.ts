import { Injectable } from "@angular/core";
import { HttpService } from "../../utility/http-service";
import { Observable } from "rxjs";
import { API } from "../../utility/constants/api";
import { Response } from "@angular/http";
import { ToastsManager } from "ng2-toastr/ng2-toastr";

@Injectable()
export class MasterChargesService {

    constructor(private httpService: HttpService, private toastManager: ToastsManager) {
    }

    _getMasterCharges() {
        return this.httpService
            .get(API.GETMASTERCHARGES)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _updateLoanWaiveoff(UserID, LoanWaiveoff) {
        return this.httpService
            .get(API.UPDATELOANWAIVEOFF + '?UserID=' + UserID + '&LoanWaiveoff=' + LoanWaiveoff)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _updateFreetoPaidKey(UserID, KeyCost) {
        return this.httpService
            .get(API.UPDATEFREETOPAIDKEYDETAILS + '?UserID=' + UserID + '&KeyCost=' + KeyCost)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _updateUserSponserJoineeRequired(UserID, IsSponserJoineesReq) {
        return this.httpService
            .get(API.UPDATEUSERSPONSERJOINEESReq + '?UserID=' + UserID + '&isSponserJoineesReq=' + IsSponserJoineesReq)
            .map(res => this.extractData(res, true)).catch((error: any) => {
                return Observable.throw(new Error(error.status));
            });
    }

    _updateUserStatus(UserID, UserStatusID) {
        return this.httpService
            .get(API.UPDATEUSERSTATUS + '?userID=' + UserID + '&userStatusID=' + UserStatusID)
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