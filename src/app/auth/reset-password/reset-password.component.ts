import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'src/app/service/dialog.service';
import { ApiService } from 'src/app/service/search.service';

@Component({
  selector: 'app-reset-password',
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,MatCardModule,MatFormFieldModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
//   constructor(private router: Router ){}
//   reset = new FormGroup({
//     pwd1: new FormControl("", [Validators.minLength(6),Validators.maxLength(8)]),
//     pwd2: new FormControl("",  [Validators.minLength(6),Validators.maxLength(8)])
//   });
//   func3(){
//     this.router.navigateByUrl('auth/login')

// }
// get pass1(){
//   return this.reset.get('pwd1');
// }
// get pass2(){
//   return this.reset.get('pwd2');
// }
// hide=1;
// val=true;
// items:any;
// valid(){
// if(this.reset.value.pwd1!==this.reset.value.pwd2){
//  this.hide=0
// }
// else {
//   this.hide=1
// }
// }

// vali(){
//   if (this.reset.value.pwd1 !==this.reset.value.pwd2){
//     this.val = false
//   } else {
//     this.val = true;
//   }
// }
forgetPassword!: FormGroup
  otpPassword!: FormGroup
  resetPassword!: FormGroup
  currentTimer: any;
  twostepverify!:FormGroup
  hide: boolean = false;
  @Input('frmLogin') frmLogin: any
  data: string = ""
  Otp: boolean = false
  sendOtp: any
  disabled: boolean = false
  passwordMismatch:boolean =false
  collection: any
  email_data: string | null = null;
  otpData: any;
  showOtpForm: boolean = false
  showResetForm: boolean = false
  show2stepForm:boolean = false
  showForm: boolean = false
  resendOtp: boolean = false;
  displayTimer: boolean = false;
  display: string = '';
  timeLeft: number = 60
  interval: any
  unamePattern = "^[a-z0-9_-]*$";
  buttonClicked: boolean = false;
  resetButtonClicked:boolean = false
  authdata:any
  constructor(
    private formBuilder: FormBuilder,
    private dataService: ApiService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,

  ) {
  }
  ngOnInit() {
    // debugger

    this.route.params.subscribe((params: any) => {
      this.data = params.user_type
    });
    this.forgetPassword = this.formBuilder.group({
      emailaddress: new FormControl(null, [Validators.required,
        Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\\.\\w{2,3})+$')
      ])
    });
    this.otpPassword = this.formBuilder.group({
      otp: new FormControl(null, Validators.required),
      // otp2: new FormControl(null, Validators.required),
      // otp3: new FormControl(null, Validators.required),
      // otp4: new FormControl(null, Validators.required),
      // otp5: new FormControl(null, Validators.required),
      // otp6: new FormControl(null, Validators.required)
    });
    this.resetPassword = this.formBuilder.group({
      newPassword: new FormControl(null, [Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,10}$')
      ]),
      confirmPassword: new FormControl(null,
         [Validators.required]),
    }, {
      validators: this.passwordMatchValidator, // Add the custom validator here
    });
  }


 passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPasswordControl = control.get('newPassword');
    const confirmPasswordControl = control.get('confirmPassword');

    if (!newPasswordControl || !confirmPasswordControl) {
      return null;
    }
    const newPassword = newPasswordControl.value;
    const confirmPassword = confirmPasswordControl.value;
    if (newPassword !== confirmPassword || newPassword === '' || confirmPassword === '') {
      return { passwordMismatch : true };
    }

    return null;
  }

  onDigitInput(event: any) {
    let element;
    if (event.code !== 'Backspace')
      element = event.srcElement.nextElementSibling;
    if (event.code === 'Backspace')
      element = event.srcElement.previousElementSibling;
    if (element == null)
      return;
    else
      element.focus();
  }

  forgotPassword() {
    // debugger
    // let id = this.frmLogin.value.userId
    let email_data = this.forgetPassword.value.emailaddress;
    console.log(email_data );
    let user_data = this.resetPassword.value
    console.log(user_data );
    let role:any = localStorage.getItem('userType')
    console.log(role);
    if (role == "Seeker") {
      this.collection = "seekers_info"
    } else if (role == "Company") {
      this.collection = "companies"
    }
    let resetPwd = {
      id: email_data,
      user_type: this.data,
      new_Password: user_data.newPassword,
      confirm_Password:user_data.confirmPassword


    }


    this.resetButtonClicked = true
    let path = "reset-password/" + `${this.collection}`
    console.log(path);

    this.dataService.resetPassword(path, resetPwd).subscribe((res: any) => {
      this.otpData = res.data
      this.resetButtonClicked = false
      if(res.status == 200){
        this.Otp =true
        this.showResetForm = false;
        this.showOtpForm = false;
        this.showForm =true
        this.dialogService.showErrorMessage("Password changed successfully")
        this.router.navigateByUrl('/auth/login')
      }else{
        console.log(res.error);
        console.log(res.message);

        this.dialogService.showErrorMessage(res.error)
         this.dialogService.showErrorMessage("Error in changing password")
      }
    });
  }


  otp() {
    // debugger
    let email_data = this.forgetPassword.value.emailaddress;
    let otp_data = this.otpPassword.value
    let parseOtp = parseInt(otp_data.otp)
    let role:any = localStorage.getItem('userType')
    console.log(role);
    if (role == "Seeker") {
      this.collection = "seekers_info"
    } else if (role == "Company") {
      this.collection = "companies"
    }
    let otpVerify: any = {
      otp: parseOtp,
      id: email_data
    }
    console.log(otpVerify);

     let path = "validate-otp/" + `${this.collection}`
    //  debugger
     if (otp_data.otp == null||otp_data.otp =='') {
      this.dialogService.showErrorMessage("Enter OTP");
    } else if (otp_data.otp.length !== 6) {
      this.dialogService.showErrorMessage("Enter Valid OTP");
    } else {
      this.dataService.getSendOtp(path, otpVerify).subscribe((res: any) => {
        if(res.status == 200) {
          this.otpData = res.data
          this.showResetForm = true;
          this.showForm =true
          this.showOtpForm = false;
        } else {
          this.dialogService.showErrorMessage(res.message);
        }
      })
    }
  }
  togglePasswordVisibility(passwordInput: HTMLInputElement) {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }
  params: any

  otpEmail() {
    // debugger
    let email_data = this.forgetPassword.value.emailaddress;
    if(email_data === null || email_data === undefined || email_data === '') {
      this.forgetPassword.markAllAsTouched();
      this.dialogService.showErrorMessage("Enter Email")
    } else {
      let user_type = localStorage.getItem('userType')
      let data = {
        id: email_data,
        user_type: user_type
      }
      console.log(data);

      this.buttonClicked = true
      let path = "send-otp/" + `${email_data}` + "/" + `${data.user_type}`
      sessionStorage.setItem('email', email_data);
      this.dataService.getSendOtp(path, data).subscribe((res: any) => {
        if(res.status == 200) {
          this.showOtpForm = true;
          this.showForm =true
          this.buttonClicked = false
          this.sendOtp = res.data
          this.dialogService.showErrorMessage(res.message)
          this.start(2);
        }
      },(error:any)=>{
        this.dialogService.showErrorMessage(error.error?.message);
        this.buttonClicked = false
      })


    }
  }

  destroyEmail() {
    sessionStorage.removeItem('email');
  }

ResendOtp(){
  // debugger
  this.displayTimer=false
  if (this.currentTimer) {
    clearInterval(this.currentTimer);
  }

  this.otpPassword.reset()
  let emailGet = sessionStorage.getItem('email')
  console.log(emailGet);

    let data = {
      email_data: emailGet,
      data: this.data
    }
    console.log(this.data);

    let path = "send-otp/" + `${emailGet}` + "/" + `${this.data}`
    this.dataService.getSendOtp(path, data).subscribe((res: any) => {
      if(res.status == 200) {
        this.showOtpForm = true;
        this.sendOtp = res.data
        this.dialogService.showErrorMessage(res.message)
        this.start(2)
      }
    },(error:any)=>{
      this.dialogService.showErrorMessage(error.error?.message);
    })
}


  login() {
    this.router.navigate(['auth/login/' +`${this.data}`]);
    // this.router.navigate(["/forgotpassword/"+`${this.type}`]);
  }
  Twostepotp() { }

  start(minute: number) {
    if (this.currentTimer) {
      clearInterval(this.currentTimer);
    }

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
      this.displayTimer = true;

      if (seconds == 0) {
        clearInterval(timer);
        this.resendOtp = true;
        this.displayTimer = false;
      }
    }, 1000);
    this.currentTimer = timer;
  }
  Resendtwostep(){}
  Twostep(){}
}
