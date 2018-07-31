export class BaseUrl {

  /* Unused as of 0.1.0 */
  public static MAIN_URL: string = "";
  public static URL: string = "";

  /* Attach your Node API here */
  public static Api: string = "http://localhost:64682/api/";
  public static LoginApi: string = "http://localhost:64682/";
  //public static Api: string = "http://api.diamandcare.com/api/";
  //public static LoginApi: string = "http://api.diamandcare.com/";

  public static ATTACHMENT_URL = ""
  public static Image: string = "";
  public static AdminRoleID: string = "928f6866-a684-412f-a68c-30fdba25885b";
  public static UserRoleID: string = "a4d94ea6-d20a-4b17-b8c2-cf299edb254a";

  public static productImage = "products/";
  public static flagImage = "countryFlags/";
  public static productThumbImage = "thumbs/";
  public static artImage = "arts/"
  public static countryFlagImage = "assets/img/flag/";

}

export class Status {
  public static Success = 200;
  public static Unauthorized = 401;
  public static Unprocessed = 422;
}

export class DateFormatters {
  public static icoDate_Format = 'YYYY-MM-DD';
  public static icoTime_Format = 'HH:mm:ss';
  public static paymentYearLimit = 15;
}

export class AppConstant {
  public static MaxImageSize = 2097152;
  public DefaultRecordsCount = 0;
  public DefaultPageSize = 10;
  public DefaultPageSizeArray: number[] = [5, 10, 20, 30];
  public Loading = "Loading....";
  public NoRecordsMsg = this.Loading;
  public NoRecordsMsgFound = "No Record Found!";
  public static staticToken = "YOUR_TOKEN_HERE";
}

export function Logger(value1, value2?) {
}
