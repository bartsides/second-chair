import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function mustContainDigit(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /\d/.test(control.value);
    if (valid) return null;
    return { mustContainDigit: true };
  };
}

function mustContainLowercase(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /[a-z]/.test(control.value);
    if (valid) return null;
    return { mustContainLowercase: true };
  };
}

function mustContainUppercase(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /[A-Z]/.test(control.value);
    if (valid) return null;
    return { mustContainUppercase: true };
  };
}

function mustContainNonAlphanumeric(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let regex = /([^a-zA-Z\d])+([a-zA-Z\d])+|([a-zA-Z\d])+([^a-zA-Z\d])+/;
    const valid = regex.test(control.value);
    if (valid) return null;
    return { mustContainNonAlphanumeric: true };
  };
}

export {
  mustContainDigit,
  mustContainLowercase,
  mustContainNonAlphanumeric,
  mustContainUppercase,
};
