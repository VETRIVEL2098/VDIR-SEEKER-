import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/service/search.service';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { DialogService } from 'src/app/service/dialog.service';

// import { DialogService } from '../../service/dialog.service';


@Component({
  selector: 'app-login',
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,MatFormFieldModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {
  Seeker:any=true
  payload:any;
  Employer:any
  localAuth:any
  showPassword: boolean = false;
  params:any
  category:any
  otpData:any
  tokenValue:any
  collection:any
  currentTimer:any
  showData:boolean=true
  displayTimer: boolean = false;
  resendOtp: boolean = false;
  display:any;
  show2stepForm:boolean=false
  constructor(private router: Router, private http: HttpClient, private auth: ApiService,private route:ActivatedRoute,
    private snackbarService: DialogService){
    this.route.params.subscribe((xyz:any)=>{
      let data =xyz['id']
      this.params = data

    })
  }
  ngOnInit(): void {
    //
  }
  togglePasswordVisibility(passwordInput: HTMLInputElement) {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }
// Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$") Email pattern
  logo = new FormGroup({
    login_id: new FormControl(""),
    password: new FormControl("")
    //  role: new FormControl()   //, [Validators.pattern('((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})')]
  });
  twostepverify = new FormGroup({
    otp: new FormControl(""),
  });
  Login() {
    if (this.logo.valid) {
      const formData = this.logo.getRawValue();

      if (this.Seeker) {
        console.log(formData);

        this.auth.login(formData).subscribe(
          (val: any) => {
            if (val.error) {
              alert('Error: ' + val.error);
            } else {
              this.tokenValue = val.token;
              console.log(val);

              if (val !== "") {
                console.log(this.tokenValue);
                this.start(2);
                this.showData = false;
                this.show2stepForm = true;
                this.Otp_Verify();
              }
            }
          },
          (error:any) => {
            this.snackbarService.showErrorMessage('Invalid email or password');
console.error(error)
          }
        );
      }
    }
  }

  start(minute: number) {
    // Clear the current timer if it exists
    if (this.currentTimer) {
      clearInterval(this.currentTimer);
    }

    this.displayTimer = true;
    this.resendOtp = false;
    let seconds = minute * 60;
    let textSec: any = '0';
    let statSec = 60;

    const prefix = minute < 10 ? '0' : '';

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else {
        textSec = statSec;
      }

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        clearInterval(timer);
        this.resendOtp = true;
        this.displayTimer = false;
      }
    }, 1000);

    // Store the new timer in the currentTimer variable
    this.currentTimer = timer;
  }

  sendOtp:any
  Resendtwostep() {
    // Clear the current timer if it exists
    if (this.currentTimer) {
      clearInterval(this.currentTimer);
    }
    let role:any = localStorage.getItem('userType')
    let user_data = this.logo.value.login_id;
    let data = {
      email_data: user_data,
      data: role,
    };
    console.log(role);
    let path = "send-otp/" + `${user_data}` + "/" + `${role}`;
    this.auth.getSendOtp(path, data).subscribe((res: any) => {
      this.show2stepForm = true;
      this.sendOtp = res.data;
      this.start(2)
      this.snackbarService.showErrorMessage(res.message)
    });
  }

func1(){
  let user_type = localStorage.getItem('userType')
  console.log(user_type);
  this.router.navigateByUrl('auth/reset')
}
func2(data:any){
  this.router.navigateByUrl('auth/register/'+data)
  localStorage.setItem('category',data)
}
func3(){
  this.router.navigateByUrl('/home')
}
get fname(){
  return this.logo.get('login_id');
}
get psd(){
  return this.logo.get('password');
}
submit() {
  // debugger
  let user_data = this.logo.value.login_id
  let otp_data = this.twostepverify.value
  let combinedOTP:any = otp_data.otp
  let role:any = localStorage.getItem('userType')
  console.log(role);

  const OTP = parseInt(combinedOTP);
  if (role == "Seeker") {
    this.collection = "seekers_info"
  } else if (role == "Company") {
    this.collection = "companies"
  }

  let otpVerify: any = {
    otp: OTP,
    id: user_data
  }
  let path = "validate-otp/" + `${this.collection}`
  if (otp_data.otp == null || otp_data.otp == '') {
    // this.snackbarService.showErrorMessage("Enter OTP");
  } else if (otp_data.otp.length !== 6) {
    this.snackbarService.showErrorMessage("Enter Valid OTP");
  } else {
    this.auth.getSendOtp(path, otpVerify).subscribe((res: any) => {
      this.otpData = res
      let arr:any []=[]
      if (res.status == 200) {
        this.auth.decodeTokendata(this.tokenValue).then((data:any)=>{
          console.log(data);

          console.log(data.email);
          let payload=data
          console.log(payload);
          const filterValue: any = [
            {
              clause: "$and",
              conditions: [
                { column: "unique_id", operator: "$eq", value:payload.unique_id },
              ]
            }
          ];
          this.auth.getDataByFilter(payload.Collection,filterValue).subscribe((data:any)=>{
              console.log(data);

              arr.push({token:this.tokenValue})
            arr.push(data[0]);
         this.auth.storedToken(arr);
         if (role == "Seeker") {
          this.router.navigate(['/home']);
        } else if (role == "Company") {
          this.router.navigate(['/admin/dashboard']);

        }
        //  localStorage.setItem('token', this.tokenValue);


          })

        })
          // localStorage.setItem('token',this.token)
          // localStorage.setItem('remember_me', this.logo.value.remember_me)
        // sessionStorage.setItem('token',this.tokenValue);
        this.show2stepForm = false;


        // }
        this.snackbarService.showErrorMessage(res.message)
      }
    }, (error: any) => {
      this.show2stepForm = true
      this.snackbarService.showErrorMessage(error.error?.message);
    })
  }
}
otp:any;
Otp_Verify() {
  let email_data = this.logo.value.login_id;
  let role:any = localStorage.getItem('userType')
  console.log(role);

  let data = {
    email_data: this.logo.value.login_id,
    data: role
  }
  console.log(data);

  let path = "send-otp/" + `${email_data}` + "/" + `${role}`
  // sessionStorage.setItem('email', email_data);
  this.auth.getSendOtp(path, data).subscribe((res: any) => {
    this.otp = res.data
    if (res.status == 200) {
      this.start(2)
      // this.show2stepForm = true;
      // this.showData = true
      //  })
    }
        this.snackbarService.showErrorMessage(res.message);

    // alert(res.message)
    this.submit()
  },
   (error: any) => {
    this.snackbarService.showErrorMessage(error.error?.message);
  }
  )
}

}





