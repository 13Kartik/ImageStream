import { Injectable } from '@angular/core';

import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  private httpOptions = {
    headers:new HttpHeaders({
      'Content-Type':'application/json'
    })
  }

  private api:string='http://localhost:5174/api';

  constructor(private http:HttpClient) {

   }

  login(userData:any):Observable<any>{
    return this.http.post<any>(this.api+'/login/api/login',userData,this.httpOptions);
  }

  signUp(userData:any):Observable<any>{
    return this.http.post<any>(this.api+'/SignUp/api/SignUp',userData,this.httpOptions);
  }
}
