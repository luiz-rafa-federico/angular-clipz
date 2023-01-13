import { ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';

export class RegisterValidators {
  static match(controlName: string, matchingControlName: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      // we have control over the whole form group
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlName);

      if (!control || !matchingControl) {
        console.error('Form controls not found in the form group');
        return { controlNotFound: false };
      }

      const err =
        control.value === matchingControl.value ? null : { noMatch: true };

      matchingControl.setErrors(err); // error will appear on this control

      return err;
    };
  }
}

// new RegisterValidators -> static -> we can call the method without having a new instance
// RegisterValidators.match()
// with static method we do not have access to a property of this class (limited scope)
