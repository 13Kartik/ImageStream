import { Injectable } from '@angular/core';

import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  api:string='http://192.168.1.17:8056/api/';
  // private userId:string = '9e051ee3-4858-428d-a98b-d5baad632110';
  public userId:string|null = localStorage.getItem("userId");

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
    return this.http.post<any>(this.api+'ImageBlockGeneration/UploadImage?userId='+this.userId,file);
  }

  uploadImageBlock(blockData:object){
    console.log('uploaded imageBlock');
    console.log(blockData);
    return this.http.post<any>(`${this.api}ImageBlockGeneration/GenerateImage`,blockData);
  }

  getUploadedImages(){
    return this.http.get<any>(`${this.api}ImageBlockGeneration/GetAllImage/${this.userId}`);
  }

  getPlaceHolders(){
    return this.http.get<any>(`${this.api}ImageBlockGeneration`);
  }

  getImageBlock(imageBlockId:string){
    return this.http.get<any>(`${this.api}ImageBlockGeneration/GetUserImageBlock/${imageBlockId}`);
  }

  updateImageBlock(blockData:object){
    return this.http.post<any>(`${this.api}ImageBlockGeneration/UpdateUserImageBlock`,blockData);
  }

  getLoggedUserImageBlockes(){
    return this.http.get<any>(`${this.api}ImageBlockGeneration/${this.userId}`);
  }

}
