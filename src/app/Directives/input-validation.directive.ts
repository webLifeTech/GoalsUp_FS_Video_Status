import { Directive } from '@angular/core';
import { AbstractControl, Validator, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appInputValidation]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: InputValidationDirective,
    multi: true
  }]
})
export class InputValidationDirective implements Validator{

  constructor() { }

  validate(control: AbstractControl) : {[key: string]: any} | null {
    
    if (control.value && control.value.length != 10) {
      return { 'phoneNumberInvalid': true };
    }
    return null;
  }

}
