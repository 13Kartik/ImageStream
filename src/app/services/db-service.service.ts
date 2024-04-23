import { Injectable } from '@angular/core';

import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  private api:string='https://broadly-dominant-lemming.ngrok-free.app/api';

  private httpOptions = {
    headers:new HttpHeaders({
      'Content-Type':'application/json'
    })
  }
  constructor(private http:HttpClient) {}

  login(userData:object):Observable<any>{
    return this.http.post<any>(this.api+'/Auth/login',userData,this.httpOptions);
  }

  signUp(userData:object):Observable<any>{
    return this.http.post<any>(this.api+'/Auth/Signup',userData,this.httpOptions);
  }
  upload(file:any):Observable<any>{
    return this.http.post<any>(this.api+'/Image/uploadImage',file);
  }

  uploadImageBlock(blockData:object){
    return this.http.post<any>(this.api+'/NewStaticImages/upload',blockData);
  }
}
