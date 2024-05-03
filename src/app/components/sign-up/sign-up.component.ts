import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, Input } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// fontawesome import
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
  import { faArrowRightToBracket, faEnvelope, faKey, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

// importing custome validators
import { passwordMatch } from '../../custome-validations/passwordMatch';
import { DbServiceService } from '../../services/db-service.service';

import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule, FontAwesomeModule, RouterModule,HttpClientModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  providers:[DbServiceService]
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
  
  constructor(private db:DbServiceService, private route: Router) {
  }

  ngOnInit() {
    console.log('ngOnInit called');
  }
  
  // Validation Code
  signupForm = new FormGroup({
    FirstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[A-Za-z]+$')]),
    LastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('^[A-Za-z]+$')]),
    Email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    PasswordHash: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, [passwordMatch("PasswordHash", "confirmPassword")]);
  
  get FirstNameValidation(): AbstractControl | null
  {
    return this.signupForm.get('FirstName');
  }
  get LastNameValidation(): AbstractControl | null
  {
    return this.signupForm.get('LastName');
  }
  get EmailValidation(): AbstractControl | null
  {
    return this.signupForm.get('Email');
  }
  get passwordValidation(): AbstractControl | null
  {
    // console.log(this.signupForm.get('password') as FormControl);
    return this.signupForm.get('PasswordHash');
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
    const params = this.signupForm.value;
    delete params.confirmPassword;

    this.db.signUp({
      'spFor':'InsertUser',
      params,
      }).subscribe({
      next: (res)=>{
        console.log(res);
        this.route.navigate(['/login']);
      },
      error: (err)=>{
        console.log("Unexpected error occurred while Signing Up ", err);
      }
    });
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