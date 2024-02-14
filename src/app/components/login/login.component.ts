import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    password: new FormControl('',[Validators.required,Validators.minLength(8)]),
    remember: new FormControl(false),
  });

  constructor(private db:DbServiceService,private router:Router){}

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

  onSubmit(){
    const data = this.loginForm.value;
    delete data.remember;

    this.db.login(data).subscribe(res=>{
      if(res.status===200){
        console.log(res.message);
        this.router.navigate(['/user']);
      } 
      else console.error(res.message);
    });
  }

}