import {Base64} from "./base64-typescript-class";
import {Observable} from "rxjs";

export class CommonFunctions {

  //noinspection JSAnnotator
  public readThis(inputValue: any): Observable<string> {
    var file: File = inputValue.files[0];
    return new Observable(obs => {
      try {
        var myReader: FileReader = new FileReader();
        myReader.onload = (e)=> {
          obs.next(myReader.result);
          obs.complete();
        }
        myReader.readAsText(file);
      } catch (e) {
        obs.error(e);
      }
    });
  }

  public static ConvertIntToBoolean(value): boolean {
    if (value == null)
      return false;
    if (value == 1) {
      return true;
    } else {
      return false;
    }
  }

  public static Logger(value1, value2?) {}

  public static isValidString(stringVal): boolean {
    let valid: boolean = false;
    if (stringVal && stringVal != "null" && stringVal != null && stringVal != "undefined") {
      valid = true
    }
    return valid;
  }
}

export function FileIsImage(filename: string): boolean {
  return (filename === 'image/png' || filename === 'image/jpeg' || filename === 'image/jpg' || filename === 'image/svg+xml');
}
