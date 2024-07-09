import { Directive } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appIpPortValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: IpPortValidatorDirective, multi: true }]

})
export class IpPortValidatorDirective implements Validator  {


  validate(control: AbstractControl): ValidationErrors | null {
    const ipPortPattern = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9]):([0-9]{1,5})$/;
    const valid = ipPortPattern.test(control.value);
    return valid ? null : { 'ipPortInvalid': true };
  }
}
