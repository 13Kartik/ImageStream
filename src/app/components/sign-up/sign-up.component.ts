import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit, OnDestroy{
  signupForm = new FormGroup(
    {
      firstName : new FormControl('', [Validators.required]),
      lastName : new FormControl('', [Validators.required]),
      email : new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      password : new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword : new FormControl('', [Validators.required, Validators.minLength(8)])
    }
  )
  get firstNameValidation()
  {
    return this.signupForm.get('firstName');
  }
  get lastNameValidation()
  {
    return this.signupForm.get('lastName');
  }
  get emailValidation()
  {
    return this.signupForm.get('email');
  }
  get passwordValidation()
  {
    return this.signupForm.get('password');
  }
  get confirmPasswordValidation()
  {
    return this.signupForm.get('confirmPassword');
  }

  onSubmit()
  {
    console.log(this.signupForm.value);

    let email: any = this.signupForm.value.email;
    let password: any = this.signupForm.value.password;
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
  }

  constructor() {
    console.log('Constructor called');
  }

  ngOnInit() {
    console.log('ngOnInit called');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy called');
    localStorage.clear();
  }
}
