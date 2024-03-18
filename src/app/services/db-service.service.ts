import { Injectable } from '@angular/core';

import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  api:string='http://192.168.1.17:8056/api/';
  // private user_id:string = '9e051ee3-4858-428d-a98b-d5baad632110';
  private user_id:string = 'bd2dba6f-c8b8-48c9-bdf0-d793c128e338';

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
    return this.http.post<any>(this.api+'ImageBlockGeneration/UploadImage?userId='+this.user_id,file);
  }

  uploadImageBlock(blockData:object){
    return this.http.post<any>(`${this.api}ImageBlockGeneration/generateImage`,blockData);
  }

  getUploadedImages(){
    return this.http.get<any>(`${this.api}ImageBlockGeneration/GetAllImage/${this.user_id}`);
  }

  getPlaceHolders(){
    return this.http.get<any>(`${this.api}ImageBlockGeneration`);
  }

}
