// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpErrorResponse
// } from '@angular/common/http';
// import { Observable, catchError, throwError } from 'rxjs';

// import { Router } from '@angular/router';
// import { ApiService } from 'src/app/service/search.service';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {

//   constructor(private auth : ApiService , private router : Router) {}

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     // const myToken = 

  
//       request = request.clone({ headers: request.headers.set('OrgId', "pms") });
  
//       // if(myToken){
//         request = request.clone({
//           setHeaders : { Authorization :`Bearer "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDE1MjI5ODQsImlhdCI6MTcwMTQzNjU4NCwiaWQiOiJzYW5qYXkxMjNzYW5qYXkxMkBnbWlhbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJ1b19pZCI6InBtcyIsInVvX3R5cGUiOiJwbXMifQ.z8dvKCvMgb1QV0Bdrk3B-e9LNaGFTsYd3kBJyem9APU"`}  //"Bearer"+myToken
//         })
//       // }
//       console.log(request);
      
//     return next.handle(request)
//     .pipe(
//       catchError((err: any)=>{
//         if(err instanceof HttpErrorResponse){
//           if(err.status === 401){
//             this.router.navigate(['/login']);
//           }
//         }
//         return throwError(()=>new Error("Some other error occurred"))
//       })
//     );
//   }
// }
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { DialogService } from 'src/app/service/dialog.service';
import { HelperService } from 'src/app/service/helper.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  //  selectedOrgId: string = 'amsort'

  selectedOrgId: string = sessionStorage.getItem("selectedOrgId") || ''

  constructor(public helperService: HelperService, private dialogService: DialogService) {
    this.helperService.selectedOrgId.subscribe((id:any)=>{
      this.selectedOrgId = 'pms'
      // this.selectedOrgId = 'amsort'
    })
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (this.selectedOrgId) {
      request = request.clone({ headers: request.headers.set('OrgId', "pms") });
    // }
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDE1MjQ1ODAsImlhdCI6MTcwMTQzODE4MCwiaWQiOiJzYW5qYXkxMjNzYW5qYXkxMkBnbWlhbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJ1b19pZCI6InBtcyIsInVvX3R5cGUiOiJwbXMifQ.lBhMTdejVUkXBNfs8LawtGbFt40ct1BCRhFjtZ1DjAU`
      }
    });
    return next.handle(request).pipe(
      // REST API Error handler
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          switch ((error as HttpErrorResponse).status) {
            case 400:
              if (error.error.errorMessage) {
                this.dialogService.openSnackBar(error.error.errorMessage, 'OK');
              }
              else if (error.error.message || error.error) {

                this.dialogService.openSnackBar(error.error.message ? error.error.message : 'Sorry! Something went wrong', 'OK');
              }
              else {
                this.dialogService.openSnackBar('Status 400 error.', 'OK');
              }
              return throwError(error);
            case 401:
              if (error.error || error.error.message) {
                this.dialogService.openSnackBar(error.error.message ? error.error.message : 'Sorry! Something went wrong', 'OK');
              } else {
                this.dialogService.openSnackBar('Unauthorized', 'OK');
              }
              return throwError(error);
            case 500:
              if (error.error || error.error.message) {
                this.dialogService.openSnackBar(error.error.message ? error.error.message : 'Sorry! Something went wrong', 'OK');
              } else {
                this.dialogService.openSnackBar('Internal Server Error', 'center');
              }
              return throwError(error);
            case 404:
              if (error.error || error.error.message) {
                this.dialogService.openSnackBar(error.error.message ? error.error.message : 'Sorry! Something went wrong', 'OK');
              } else {
                this.dialogService.openSnackBar('Not Found', 'OK');
              }
              console.log(error);
              return throwError(error);
            case 410:
              if (error.error || error.error.message) {
                this.dialogService.openSnackBar(error.error.message ? error.error.message : 'Sorry! Something went wrong', 'OK');
              } else {
                this.dialogService.openSnackBar('Status 410 error.', 'OK');
              }
              console.log(error);
              return throwError(error);
            default:
              this.dialogService.openSnackBar(error && error.error && error.error.message, 'OK');
              return throwError(error);
          }
        } else {
          return throwError(error);
        }
      })).pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
        }
        return evt;
      }));
  }

}
