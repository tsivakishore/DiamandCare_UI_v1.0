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
  public static USERSTATUS = 'Shared/GetUserStatus';
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
  public static GETLOANSFORUSER = 'loan/getloansforuser';
  public static CHECKPLBYUSERID = 'loan/checkpersonalloanbyuserid';
  public static CHECKFRBYUSERID = 'loan/checkfeereimbursementbyuserid';
  public static CHECKHBBYUSERID = 'loan/checkhealthbenefitbyuserid';
  public static CHECKHLBYUSERID = 'loan/checkhomeloanbyuserid';
  public static CHECKRBBYUSERID = 'loan/checkriskbenefitbyuserid';
  public static CHECKRENEWALSTATUS = 'loan/CheckRenewalStatus';
  public static CHECKRENEWALSTATUSBYUSERID = 'loan/CheckRenewalStatusbyuserid';
  public static PERSONALLOAN = 'loan/personalloan';
  public static FEEREIMBURSEMENT = 'loan/feereimbursement';
  public static HEALTHBENEFITS = 'loan/healthbenefits';
  public static RISKBENEFITS = 'loan/riskbenefits';
  public static HOMELOAN = 'loan/homeloan';
  public static PREPAIDLOAN = 'loan/prepaidloan';
  public static PERSONALLOANBYADMIN = 'loan/personalloanbyadmin';
  public static FEEREIMBURSEMENTBYADMIN = 'loan/feereimbursementbyadmin';
  public static HEALTHBENEFITSBYADMIN = 'loan/healthbenefitsbyadmin';
  public static RISKBENEFITSBYADMIN = 'loan/riskbenefitsbyadmin';
  public static HOMELOANBYADMIN = 'loan/homeloanbyadmin';
  public static PREPAIDLOANBYADMIN = 'loan/prepaidloanbyadmin';
  public static SENDSECRETKEY = 'RegisterKey/RegisterKeyGenearation';
  public static GETSECRETKEYS = 'RegisterKey/GetIssuedRegisterKeys';
  public static GENERATEMULTIPLESECRETKEYS = 'RegisterKey/GenerateMultipleRegisterKeys';
  public static GETUSERNAMEWALLETMASTERCHARGESBYDCIDorNAME = 'RegisterKey/GetUsernameWalletMasterChargesByDCIDorName';
  public static SHARESECRETKEY = 'RegisterKey/ShareRegisterKey';
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
  public static CHANGEPASSWORDBYID = 'user/changepasswordbyId';
  public static USERIMAGE = 'user/userimage';
  public static GETUSERIMAGE = 'user/GetUserImageById';
  public static GETUSERIDCARDDETAILSBYID = 'user/GetUserIdCardDetailsById';

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
  public static GETUSERSPONSERJOINEES = 'user/getUserSponserJoineeRequired';
  public static UPDATEUSERSPONSERJOINEESReq = 'user/UpdateUserSponserJoineeRequired';
  public static UPDATEFREETOPAIDKEYDETAILS = 'user/updatefreetopaidkeydetails';
  public static GETPAIDLOANS = 'loan/GetPaidLoanDetails';
  public static GETPAIDLOANSBYUSERNAMEorDCID = 'loan/GetPaidLoanDetailsByUserNameorDCID';
  public static GETACTIVELOANSBYUSERNAMEorDCID = 'loan/GetActiveLoanDetailsByUserNameorDCID';
  public static GETTRANSFERPEDNIGLOANSBYDCIDORUSERNAME = 'loan/GetLoansAmountTransferPendingByDCIDorName';
  public static GETTRANSFEREDLOANS = 'loan/GetLoansAmountTransfered';
  public static GETLOANSAMOUNTTRANSFERPENDINGDOWNLOAD = 'loan/GetLoansAmountTransferPendingDownload';
  public static GETTRANSFERREJECTEDLOANS = 'loan/GetLoansAmountTransferRejected';
  public static GETTRANSFERREJECTEDLOANSBYDCIDORUSERNAME = 'loan/GetLoansAmountTransferRejectedByDCIDorName';
  public static GETTRANSFEREDLOANSBYDCIDORUSERNAME = 'loan/GetLoansAmountTransferedByDCIDorName';
  public static GETAPPROVEDLOANSBYDCIDORUSERNAME = 'loan/getapprovedloandetailsByDCIDorName';
  public static GETPENDINGLOANSBYDCIDORUSERNAME = 'loan/getpendingloandetailsByDCIDorName';
  public static GETREJECTEDLOANSDCIDORUSERNAME = 'loan/getRejectedLoanDetailsDCIDorName';
  public static GETSECRETKEYSBYUserID = 'RegisterKey/GetIssuedRegisterKeysByUserID';
  public static GETSHAREDSECRETKEYSBYUserID = 'RegisterKey/GetSharedRegisterKeysByUserID';
  public static GETWALLETRECENTEXPENSES = 'wallet/GetWalletRecentExpenses';
  public static INSERTWALLETEXPENSES = 'wallet/InsertWalletExpenses';
  public static DELETEWALLETEXPENSES = 'wallet/DeleteWalletExpenses';
  public static GETWALLETTRANSACTIONS = 'wallet/GetWalletTransactions';
  public static GETWITHDRAWALTRANSACTIONS = 'wallet/GetWithdrawalTransactions';
  public static GETPENDINGWITHDRAWALTRANSACTIONS = 'wallet/GetPendingWithdrawalTransactions';
  public static GETREJECTEDWITHDRAWALTRANSACTIONS = 'wallet/GetRejectedWithdrawalTransactions';
  public static GETAPPROVEDWITHDRAWALTRANSACTIONS = 'wallet/GetApprovedWithdrawalTransactions';
  public static GETFRANCHISEREQUESTSTATUS = 'Shared/GetFranchiseRequestStaus';
  public static SAVEFRANCHISEREQUEST = 'franchisedetails/SaveFranchiseRequest';
  public static APPROVEFRANCHISEREQUEST = 'franchisedetails/ApproveFranchiseRequest';
  public static GETFRANCHISEREQUESTSBYUSERID = 'franchisedetails/GetFranchiseRequestsByUserID';
  public static GETALLFRANCHISEREQUESTS = 'franchisedetails/GetAllFranchiseRequests';
  public static GETUSERDETAILSBYDCIDOrUSERNAME = 'user/UserDetailsByDCIDOrUserName';
  public static GETUSERDETAILSBYUSERID = 'user/UserDetailsByUserID';
  public static USERADDRESSBYID = 'user/useraddressbyId';
  public static GETFUNDREQUEST = 'wallet/GetFundRequest';
  public static GETFUNDREQUESTSTATUS = 'wallet/GetFundRequestStatus';
  public static GETUSERWALLETMASTERCHARGES = 'RegisterKey/GetUserWalletMasterCharges';
  public static REQUESTFUNDS = 'wallet/RequestFunds';
  public static USERREQUESTFUNDSDETAILS = 'wallet/GetUserFundRequestDetails';
  public static APPROVEFUNDSREQUEST = 'wallet/ApproveFundsRequest';
  public static TRANSFERFUNDS = 'wallet/UpdateFundsTransfer';
  public static WITHDRAWFUNDS = 'wallet/WithdrawFunds';
  public static GETREPORTTYPES = 'reports/GetReportTypes';
  public static DOWNLOADREPORTS = 'reports/DownloadReport';
  public static DOWNLOADUSERREPORTS = 'reports/DownloadUserReport';
  public static DOWNLOADALLUSERREPORTS = 'reports/DownloadAllUserReport';
  public static GETFRANCHISEDETAILS = 'franchisedetails/GetFranchiseDetails';
  public static GETSCHOOLDETAILS = 'schooldetails/GetSchoolDetails';
  public static INSERTSCHOOLDETAILS = 'schooldetails/InsertSchoolDetails';
  public static UPDATESCHOOLDETAILS = 'schooldetails/UpdateSchoolDetails';
  public static GETCOURSEMASTERDETAILS = 'coursemaster/GetCourseMasterDetails';
  public static CREATECOURSEMASTER = 'coursemaster/CreateCourseMaster';
  public static GETCOURSEDETAILSBYCOURSEMASTERID = 'coursemaster/GetCourseDetailsByCourseMasterID';
  public static GETCOURSES = 'coursemaster/GetCourses';
  public static CREATECOURSE = 'coursemaster/CreateCourse';
  public static GETFEEMASTERDETAILS = 'feemaster/GetFeeMasterDetails';
  public static CREATEFEEMASTER = 'feemaster/CreateFeeMaster';
  public static GETUSERSBYINSTITUTION = 'userbyinstitution/getusersbyuserid';
  public static REGISTERUSERSBYINSTITUTION = 'userbyinstitution/registeruserbyinstitution';
  public static GENERATEOTP = 'studentmapping/UpdateUserOTP';
  public static GENERATELOANOTP = 'studentmapping/GenerateLoanOTP';
  public static VERIFYSTUDENTOTP = 'studentmapping/VerifyStudentOTP';
  public static GETAGAINSTTYPE = 'Shared/GetAgainstType';
  public static UPDATEWITHDRAWFUNDS = 'wallet/UpdateWithdrawFunds';
  public static GETEMPLOYEEMASTER = 'Employeedetails/GetEmployeeMasterDetails';
  public static EDITEMPLOYEE = 'Employeedetails/UpdateEmployee';
  public static GETUNDEREMPLOYEES = 'UpgradeToEmployee/GetUnderEmployees';
  public static INSERTORUPDATEUPGRADEEMPLOYEE = 'UpgradeToEmployee/InsertOrUpdateUpgradeEmployee';
  public static GETUPGRADEEMPLOYEES = 'UpgradeToEmployee/GetUpgradeEmployees';
  public static UPDATEUSERSTATUS = 'user/UpdateUserStatus';

  //Display Screens
  public static GETSCREENMASTERDETAILS = 'displayscreens/GetScreenMasterDetails';
  public static CREATESCREENMASTER = 'displayscreens/CreateScreenMaster';
  public static GETROLEMENUDETAILSBYSCREENID = 'displayscreens/GetRoleMenuDetailsByScreenID';
  public static CREATEROLEMENU = 'displayscreens/CreateRoleMenu';
  public static DELETEROLEMENU = 'displayscreens/DeleteRoleMenu';

  public static GETFEEMASTERSBYUSERID = 'studentmapping/GetFeeMastersByUserID';
  public static STUDENTMAPPING = 'studentmapping/InsertStudentMapping';
  public static STUDENTMAPPINGDETAILS = 'studentmapping/GetStudentMappingDetails';

  public static RENEWLOANACCOUNT = 'renewloanaccount/RenewLoanAccount';
  public static UPLOADIMAGES = 'uploadimages/SaveImages';
  public static GETINSTITUTEIMAGESTODIAPLAY = 'uploadimages/GetImagesByInstitute';
  public static GETSCHOOLDETAILSBYDcIDOrUSERNAME = 'schooldetails/GetSchoolIDorName';
  public static GETEMPPHOTOSDISPLAY = 'schooldetails/GetEmployesImages';
  public static GETIDCARDIMAGES = 'user/GetIdCardImages';

  // EXTERNAL API CALLERS

  public static DASHBOARD = "";

}

export class IMAGEConstants {
  public static IMAGE_FILE_SIZE_LIMIT = 1e+7;
  public static VALID_IMAGE_SIZE = 'Image should be gif/jpeg/jpg/png and less than 10MB';
}
