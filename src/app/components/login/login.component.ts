import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightToBracket, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  passwordType:string = 'password';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    password: new FormControl('',[Validators.required,Validators.minLength(8)]),
    remember: new FormControl(false),
  });

  get email(){
    return this.loginForm.get('email');
  }
  get password(){
    return this.loginForm.get('password');
  }

  loginIcon = faArrowRightToBracket;
  mailIcon = faEnvelope;
  passwordIcon = faLock;

  //eye icons
  eyeIcon = faEye;

  togglePassword(){
    if(this.passwordType==='text')
    {
      this.passwordType='password';
      this.eyeIcon = faEye;
    }
    else{
      this.passwordType='text';
      this.eyeIcon = faEyeSlash;
    }
  }
}