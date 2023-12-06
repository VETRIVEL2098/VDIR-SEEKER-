import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './search.service';

@Injectable({
  providedIn: 'root'
})
export class AuthsGuard implements CanActivateChild {
  constructor(private auth:ApiService,private route:Router){}

  canActivateChild():boolean
  {
    return true
    if(this.auth.islogin())
    {
      console.log(this.auth.getrole());
      
      if(this.auth.getrole()=="Company")
      {
        this.route.navigate(['admin','userprofile'])
        return true
      }else{
        return true //change into false
      }
      }
    else
    {
      this.route.navigate(['auth','login','seeker'])
      return false
    }
  }

}
// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
// import { ApiService } from './search.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthsGuard implements CanActivate {
//   constructor(private auth:ApiService,private route :Router){}
//   canActivate():boolean{
//     if(this.auth.getrole()=="Company")
//     {
//       this.route.navigate(['admin','userprofile'])
//       return true
//     }else{
//       this.route.navigateByUrl('dashboard/home')
//       return false //change into false
//     }

//   }
// }

  



