export class API {

  // INTERNAL API ROUTES

  public static Login = 'auth/login';
  public static COUNTRY = 'country';
  public static SIGNUP = 'accounts/registeruser';
  public static USERDETAILS = 'user/getuserbyloginid';
  public static USERPROFILE = 'user/usersprofile';
  public static UPDATEUSERPROFILE = 'user/updateuserprofile';
  public static USERADDRESS = 'user/useraddress';
  public static UPDATEUSERADDRESS = 'user/updateuseraddress';
  public static GETNOMINEEDETAILS = 'user/getnomineedetails';
  public static ADDorMODIFYNOMINEE = 'user/addupdatenomineedetails';
  public static UPDATE_USER_DETAIL = 'user/updateuserdetails';
  public static UPDATE_SECURE_LOGIN = 'user/updatesecurelogin';
  public static STATE = 'Shared/GetState';
  public static SCHOOLDETAILS = 'Shared/GetSchool';
  public static SOURCEOFUSER = 'Shared/sourceofuser';
  public static ACCOUNTTYPES = 'Shared/accounttypes';
  public static BANKNAMES = 'Shared/banks';
  public static NOMINEERELATIONS = 'Shared/nomineerelations';
  public static SPONSERDETAILS = 'Shared/GetSponserDetails';
  public static LoanEarns = 'LoanEarns/GetLoanEarns';
  public static LOANAPPROVED = 'loan/approvedorrejectloan';
  public static GETLOANS = 'loan/getloans';
  public static GETLOANDETAILSBYLOANID = 'loan/getloandetailsbyloanid';
  public static GETAPPROVEDLOANS = 'loan/getapprovedloandetails';
  public static GETACTIVELOANSBYUSERID = 'loan/GetActiveLoanDetailsByUserID';
  public static UPDATEUSERLOANPAYMENT = 'loan/UpdateUserLoanPayment';
  public static GETPENDINGLOANS = 'loan/getpendingloandetails';
  public static GETREJECTEDLOANS = 'loan/GetRejectedLoanDetails';
  public static GETAPPROVEDLOANSBYUSERID = 'loan/getapprovedloandetailsuserid';
  public static GETPENDINGLOANSBYUSERID = 'loan/getpendingloandetailsuserid';
  public static GETREJECTEDLOANSBYUSERID = 'loan/GetRejectedLoanDetailsByUserID';
  public static GETREJECTEDLOANSBYDCIDORUSERNAME = 'loan/GetRejectedLoanDetailsByDCIDorUserName';
  public static GETTRANSFERPENDINGLOANS = 'loan/GetLoansAmountTransferPending';
  public static GETPAIDLOANSBYUSERID = 'loan/GetPaidLoanDetailsByUserID';
  public static GETLOANDETAILS = 'loan/getloandetails';
  public static DOWNLOADS = 'loan/downloadfile';
  public static CHECKPL = 'loan/checkpersonalloan';
  public static CHECKFR = 'loan/checkfeereimbursement';
  public static CHECKHB = 'loan/checkhealthbenefit';
  public static CHECKHL = 'loan/checkhomeloan';
  public static CHECKRB = 'loan/riskbenefit';
  public static CHECKRENEWALSTATUS = 'loan/CheckRenewalStatus';
  public static PERSONALLOAN = 'loan/personalloan';
  public static FEEREIMBURSEMENT = 'loan/feereimbursement';
  public static HEALTHBENEFITS = 'loan/healthbenefits';
  public static RISKBENEFITS = 'loan/riskbenefits';
  public static HOMELOAN = 'loan/homeloan';
  public static PREPAIDLOAN = 'loan/prepaidloan';
  public static SENDSECRETKEY = 'RegisterKey/RegisterKeyGenearation';
  public static GETSECRETKEYS = 'RegisterKey/GetIssuedRegisterKeys';
  public static GENERATEMULTIPLESECRETKEYS = 'RegisterKey/GenerateMultipleRegisterKeys';
  public static GETUSERNAMEWALLETMASTERCHARGESBYDCIDorNAME = 'RegisterKey/GetUsernameWalletMasterChargesByDCIDorName';
  public static RESENDSECRETKEY = 'Shared/ResendSMS';
  public static VERIFY_SECRETKEY = 'Shared/VerifyKey';
  public static GETMODEOFTRANSFER = 'Shared/GetModeofTransfer';
  public static ADDMASTERCHARGES = 'MasterCharges/AddMasterCharges';
  public static GETMASTERCHARGES = 'MasterCharges/GetMasterCharges';
  public static GETMENU = 'user/getmenu';
  public static GETUSERSANDROLES = 'user/getusersandrole';
  public static GETALLROLES = 'user/getroles';
  public static UPDATEUSERROLE = 'user/updateuserrole';
  public static FORGETPASSWORD = 'user/forgetpassword';
  public static CHANGEPASSWORD = 'user/changepassword';
  public static GETTREEVIEWDATA = 'treedata/GetTreeData';
  public static INSERTORUPDATEBANKDETAILS = 'userbankdetails/InsertorUpdateUserBankDetails';
  public static GETUSERBANKDETAILS = 'userbankdetails/GetUserBankDetails';
  public static NEWROLE = 'role/newrole';
  public static UPDATEROLE = 'role/updaterole';
  public static GETFRANCHISEMASTER = 'franchisedetails/GetFranchiseMasterDetails';
  public static GETFRANCHISETYPES = 'franchisedetails/GetFranchiseTypes';
  public static EDITFRANCHISE = 'franchisedetails/UpdateFranchise';
  public static GETUPGRADETO = 'franchisedetails/GetUpgradeTo';
  public static GETUSERNAMEBYDCIDorNAME = 'franchisedetails/GetUsernameByDCIDorName';
  public static GETUNDERFRANCHISEDETAILS = 'franchisedetails/GetUnderFranchiseDetails';
  public static INSERTorUPDATEFRANCHISEDETAILS = 'franchisedetails/InsertorUpdateFranchiseDetails';
  public static GETWALLET = 'wallet/getwallet';
  public static GETTRANSFERSTATUS = 'Shared/loantransferstatus';
  public static GETTRANSFERAPPROVALSTATUS = 'loan/LoanTransferApprovedOrRejected';
  public static GETFRANCHISEUSERNAMEWALLETBYIDORNAME = 'franchisedetails/GetFranchiseUsernameWalletByIDorName';
  public static UPDATEFRANCHISEWALLETBALANCE = 'franchisedetails/UpdateFranchiseWalletBalance';
  public static UPDATELOANWAIVEOFF = 'user/updateloanwaiveoff';
  public static GETFREETOPAIDUSERDETAILS = 'user/getfreetopaiduserdetails';
  public static UPDATEFREETOPAIDKEYDETAILS = 'user/updatefreetopaidkeydetails';
  public static GETTRANSFERPEDNIGLOANSBYDCIDORUSERNAME = 'loan/GetLoansAmountTransferPendingByDCIDorName';
  public static GETTRANSFEREDLOANS = 'loan/GetLoansAmountTransfered';
  public static GETTRANSFERREJECTEDLOANS = 'loan/GetLoansAmountTransferRejected';
  public static GETTRANSFERREJECTEDLOANSBYDCIDORUSERNAME = 'loan/GetLoansAmountTransferRejectedByDCIDorName';
  public static GETTRANSFEREDLOANSBYDCIDORUSERNAME = 'loan/GetLoansAmountTransferedByDCIDorName';
  public static GETAPPROVEDLOANSBYDCIDORUSERNAME = 'loan/getapprovedloandetailsByDCIDorName';
  public static GETPENDINGLOANSBYDCIDORUSERNAME = 'loan/getpendingloandetailsByDCIDorName';
  public static GETREJECTEDLOANSDCIDORUSERNAME = 'loan/getRejectedLoanDetailsDCIDorName';

  // EXTERNAL API CALLERS

  public static DASHBOARD = "";

}

export class IMAGEConstants {
  public static IMAGE_FILE_SIZE_LIMIT = 1e+7;
  public static VALID_IMAGE_SIZE = 'Image should be gif/jpeg/jpg/png and less than 10MB';
}
