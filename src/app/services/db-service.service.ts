import { Injectable } from '@angular/core';

import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  private api:string='http://192.168.1.94:8032/api';

  private httpOptions = {
    headers:new HttpHeaders({
      'Content-Type':'application/json'
    })
  }

  constructor(private http:HttpClient) {}

  login(userData:object):Observable<any>{
    return this.http.post<any>(this.api+'/login',userData,this.httpOptions);
  }

  signUp(userData:object):Observable<any>{
    return this.http.post<any>(this.api+'/SignUp',userData,this.httpOptions);
  }
}
