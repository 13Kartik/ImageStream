import { Injectable } from '@angular/core';

import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  private api:string='http://192.168.1.5:8033/api/';
  private user_id:string = '9e051ee3-4858-428d-a98b-d5baad632110';

  private httpOptions = {
    headers:new HttpHeaders({
      'Content-Type':'application/json'
    })
  }
  constructor(private http:HttpClient) {}

  login(userData:object):Observable<any>{
    return this.http.post<any>(this.api+'StoredProcedure/executeSp',userData,this.httpOptions);
  }

  signUp(userData:object):Observable<any>{
    return this.http.post<any>(this.api+'StoredProcedure/executeSp',userData,this.httpOptions);
  }

  uploadImage(file:any):Observable<any>{
    return this.http.post<any>(this.api+'SPStaticImage/upload',file);
  }

  uploadImageBlock(blockData:object){
    return this.http.post<any>(`${this.api}SPStaticImage/generate`,blockData);
  }

  getUploadedImages(){
    return this.http.get<any>(`${this.api}SPStaticImage/${this.user_id}/images`);
  }

}
