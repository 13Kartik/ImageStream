import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator function to check if password and confirm password match
export function passwordMatchValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    console.log(password, confirmPassword);
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  };
}