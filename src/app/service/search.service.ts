import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router from '@angular/router'
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private userPayLoad: any;
  private details: any; // Remove the duplicate declaration of 'value'

  // private baseUrl: string = 'http://10.0.0.157:7071/';
  private baseUrl: string ='http://10.0.0.123:7000/'

  // private baseUrl: string = 'http://127.0.0.1:7000/';
  public getWsBaseUrl() {

    return 'http://10.0.0.123:7000/'
    // return 'http://127.0.0.1:7000/'

  }
  constructor(private http: HttpClient, private router: Router) {
    this.userPayLoad = this.decodeToken();
  }

  GetByID(Collection:any,Column:any,Value:any,data?:any){
    // console.log(data);
    if(data=='true'){
      return this.http.get(`${this.baseUrl+Collection+'/'+Column+'/'+Value+'/'+data}`);
    }else{
      return this.http.get(`${this.baseUrl+Collection+'/'+Column+'/'+Value}`);
    }
   }

  login(loginObj: any) {
    return  this.http.post(`${this.baseUrl}auth/login`, loginObj);
  }

  getrole(){
    let role=this.decodeToken().role
    if(role){
      console.log(role);
      return role
    }
  }

  islogin():boolean{
    if( !!localStorage.getItem('token')){
      return true
    }
    else{
      return false
    }
  }

getfilterjob(data:any){
  return this.http.post(this.getWsBaseUrl() + 'matching/jobs' , data);
}

  getbyid(collectionName:any,id:any){
  return this.http.get(this.getWsBaseUrl() + 'entities/' + collectionName+'/'+id);
}

 getdetails(){
  let value:any=localStorage.getItem("auth")
  let details:any=JSON.parse(value)
  return details
 }

 GetALL(Collection:any){
  return this.http.get(this.getWsBaseUrl()+ 'entities/' + Collection);
 }

 getDataList(collectionName:any) {
  return this.http.get(this.getWsBaseUrl() + 'entities/' + collectionName);
}

  fileUpload(data: any) {
    return this.http.post(`${this.baseUrl}user_resume/upload`, data);
  }

  finalfileUpload(data: any,id:any) {
    console.log(id);

    return this.http.post(this.getWsBaseUrl()+'uploads/s3', data);
  }

  signOut() {
    localStorage.clear();
    // this.router.navigate(['/login']);
  }

  storedToken(tokenValue: any,type?:boolean) {
    if(type){
      let data:any = JSON.stringify(tokenValue);
      localStorage.setItem('auth', data);
        return true;
    }else{
      let data:any = JSON.stringify(tokenValue[1]);
      localStorage.setItem('auth', data);
      localStorage.setItem('token', tokenValue[0].token);
      return true;
    }

  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): Promise<any>{
    return new Promise(async(resolve, reject) => {
      console.log(!!localStorage.getItem('token'));

    resolve(!!localStorage.getItem('token'));
    })
  }

  decodeToken() {
    const JwtHelper = new JwtHelperService();
    let token: any = this.getToken();
    return JwtHelper.decodeToken(token);
  }

  decodeTokendata(data:any):Promise<any> {
     return new Promise(async(resolve, reject) => {
      // resolve(!!localStorage.getItem('token'));
      const JwtHelper = new JwtHelperService();
      let token= JwtHelper.decodeToken(data);
      console.log(token);
      resolve(token);
      })
  }

  public getSendOtp(path: any,data:any) {
    //  id = id.replace(/\//g,"%2F")
    return this.http.post(this.getWsBaseUrl()+ path ,data);
  }

  public reSendOtp(email: any,userType:any,data:any) {
    return this.http.post(this.getWsBaseUrl()+ "send-otp/" + `${email}` + "/" + `${userType}`, data);
  }

  public save(collectionName:any, data:any) {
		return this.http.post(this.getWsBaseUrl() + 'entities/' + collectionName, data);
	}

	public update(collectionName:any, id:any, data:any) {
		return this.http.put(this.getWsBaseUrl() + 'entities/' + collectionName + '/' + id, data);
	}

  public getDataByFilter(collectionName:any, filter:any) {
 		return this.http.post(this.getWsBaseUrl()  + collectionName , filter);
  }

  public resetPassword(collectionName:any, data:any) {
    return this.http.post(this.getWsBaseUrl() + collectionName , data);
 }

public updateVisitor(collectionName:any, id:any, data:any) {
		return this.http.put(this.getWsBaseUrl()  + collectionName + '/' + id, data);
	}
  public deleteData(collectionName:any, id:any) {
    return this.http.delete(this.getWsBaseUrl() +'entities/'+ collectionName + '/' + id);
  }
}

