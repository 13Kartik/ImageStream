import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

// fontawesome import
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightToBracket, faEnvelope, faKey, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

// importing custome validators
import { passwordMatch } from '../../custome-validations/passwordMatch';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit{

  // fontawesome icon declaration
  loginIcon = faArrowRightToBracket;
  mailIcon = faEnvelope;
  passwordIcon = faKey;
  eyeIconPassword = faEye;
  eyeIconConfirmPassword = faEye;

  // variable used in this components 
  passwordType:string = 'password';
  confirmPasswordType:string = 'password';
  
  constructor() {
    console.log('Constructor called');
  }

  ngOnInit() {
    console.log('ngOnInit called');
  }
  
  // Validation Code
  signupForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[A-Za-z]+$')]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[A-Za-z]+$')]),
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, [passwordMatch("password", "confirmPassword")]);
  
  get firstNameValidation(): AbstractControl | null
  {
    return this.signupForm.get('firstName');
  }
  get lastNameValidation(): AbstractControl | null
  {
    return this.signupForm.get('lastName');
  }
  get emailValidation(): AbstractControl | null
  {
    return this.signupForm.get('email');
  }
  get passwordValidation(): AbstractControl | null
  {
    // console.log(this.signupForm.get('password') as FormControl);
    return this.signupForm.get('password');
  }
  get confirmPasswordValidation(): AbstractControl | null
  {
    // console.log(this.signupForm.get('confirmPassword'));
    // console.log(this.signupForm.get('confirmPassword') as FormControl);
    return this.signupForm.get('confirmPassword');
  }

  // handling from submit method
  onSubmit()
  {
    console.log(this.signupForm.value);
  }

  togglePassword(inputType: string){
    // console.log(inputType);
    if(inputType == "password")
    {
      this.passwordType = "text";
      this.eyeIconPassword = faEyeSlash;
    }else{
      this.passwordType = "password";
      this.eyeIconPassword = faEye;
    }
  }
  
  toggleConfirmPassword(inputType: string)
  {
    // console.log("confirm",inputType);
    if(inputType == "password")
    {
      this.confirmPasswordType = "text";
      this.eyeIconConfirmPassword = faEyeSlash;
    }
    else{
      this.confirmPasswordType = "password";
      this.eyeIconConfirmPassword = faEye;
    }
  }
}