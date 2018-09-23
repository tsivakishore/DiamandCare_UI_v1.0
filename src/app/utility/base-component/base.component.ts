import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ToastsManager} from "ng2-toastr";

@Component({
  selector: 'app-base-component',
  templateUrl:'./base.component.html'
})
export class BaseComponent implements OnInit {

  isFormSubmitted:boolean = false;

  constructor(public toastr:ToastsManager,
              public vcr:ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {

  }

  // Form Validation Methods
  isRequiredField(formControlName){
    return (formControlName.hasError('required') && formControlName.touched) || (formControlName.pristine && this.isFormSubmitted);
  }
  isTimeRequiredField(formControlName){
    return formControlName.hasError('required') && formControlName.pristine;
  }

  isValidField(formControlName){
    return formControlName.hasError('pattern');
  }

  controlHasError(control,errorName){
    return control.hasError(errorName);
  }

  hasError(errorName,formGroup,formControl){
    return formGroup.hasError(errorName) && formControl.touched;
  }

  groupError(errorName,formGroup,formControlName){
    return (formGroup.hasError(errorName)) || (formControlName.pristine && this.isFormSubmitted);
  }

  isValidLength(formControlName){
    return formControlName.hasError('minlength') || formControlName.hasError('maxlength');
  }

  isZero(formControlName){
    return formControlName.hasError('zero');
  }

  isMinValueField(formControlName){
    return (formControlName.hasError('min') && formControlName.touched) || (formControlName.pristine && this.isFormSubmitted);
  }

  isMaxValueField(formControlName){
    return (formControlName.hasError('max') && formControlName.touched) || (formControlName.pristine && this.isFormSubmitted);
  }

  getOTP(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
