import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

//icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightToBracket, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { CommonModule } from '@angular/common';

//api
import { HttpClientModule } from '@angular/common/http';
import { DbServiceService } from '../../services/db-service.service';

//router
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[DbServiceService]
})
export class LoginComponent {

  passwordType:string = 'password';
  
  err_msg:string='';

  loginForm = new FormGroup({
    Email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    Password: new FormControl('',[Validators.required,Validators.minLength(8)]),
    remember: new FormControl(false),
  });

  constructor(private db:DbServiceService,private router:Router){}

  get Email(){
    return this.loginForm.get('Email');
  }
  get Password(){
    return this.loginForm.get('Password');
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

  onSubmit() {
    const params = this.loginForm.value;
    delete params.remember;
  
    this.db.login({
        "spFor": "ValidateUser",
        params,
    }).subscribe({
      next:(res: any) => {
          this.router.navigate(['/user/ImageGenerator']);
          localStorage.setItem("userId", res.userId);
          console.log(res.userId);
        },
      error:(error) => {
          if (error.status === 401) {
            console.log(error);
            this.err_msg = error.error.message;
          } else {
            console.error(error);
          }
        }
      }
    );
  }
  

  clear_err_msg(){
    this.err_msg='';
  }
}