import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/service/search.service';
import {MatChipsModule} from '@angular/material/chips';
import{ v4 as uuidv4} from 'uuid'
import { DialogService } from 'src/app/service/dialog.service';

@Component({
  selector: 'app-registration',
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,MatChipsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  Seeker:any=true
  Company:any
  business:any
  category:any;
  selfEmployer:boolean=true;
url:any=null;
url1:any=null;
url2:any=null;
  data:any
  constructor(private router: Router ,private http:HttpClient,private auth:ApiService,private fb:FormBuilder,private route:ActivatedRoute, private snackbarService: DialogService){
    this.route.params.subscribe((xyz:any)=>{
      let data =xyz['id']
      if(data =="Company"){
        this.Seeker = false;
        this.selfEmployer=false
        this.Company=true
      }else if(data =="Seeker"){
        this.Seeker = true;
        this.selfEmployer=false
        this.Company=false
      }else{
        this.Seeker = false;
        this.selfEmployer=true
        this.Company=false
      }
    })
    this.data = localStorage.getItem('cateory')
if(this.data=='Company'){
this.category=='Company'
}else{
  this.category='Seeker'
}
this.auth.GetALL('business_category').subscribe((res:any)=>{

this.business=res
console.log(this.business);

})
  }
  noSpacesValidator(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value && (control.value as string).trim().length === 0) {
          return { 'noSpaceAtStartEnd': true };
        }
        if (control.value && (control.value as string).trim() !== control.value) {
          return { 'noSpaceAtStartEnd': true };
        }
        return null;
      };
    }
    noSpacesAtStartOrEnd(control: any) {
      if (control.value && (control.value[0] === ' ' || control.value[control.value.length - 1] === ' ')) {
        return { 'hasSpaces': true };
      }
      return null;
    }

    ageValidator(control: AbstractControl): { [key: string]: boolean } | null { {


    const enteredDate = new Date(control.value);
    const today = new Date();
    const differenceInMilliseconds = Math.abs(today.getTime() - enteredDate.getTime());
    const differenceInYears = Math.round(differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));


    if(differenceInYears>=18){
    return null;
    }else{
    return { underage: true };
    }
    }
    }
minLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const inputValue: string = control.value;
    if (inputValue && inputValue.trim().length < minLength) {
      return { 'minLength': { requiredLength: minLength, actualLength: inputValue.trim().length } };
    }
    return null;
  };
}

    regis = new FormGroup({


    firstName: new FormControl("", [Validators.required,this.noSpacesAtStartOrEnd,Validators.pattern(/^[A-Za-z.]+( [A-Za-z.]+)*$/)]),
    lastName: new FormControl("", [Validators.required,this.noSpacesAtStartOrEnd,Validators.pattern(/^[A-Za-z.]+( [A-Za-z.]+)*$/)]),
    address: new FormControl("", [Validators.required]),
    email: new FormControl("", [ Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),Validators.required]),
    password: new FormControl("", [this.noSpacesAtStartOrEnd,Validators.required,Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/)]),
    role: new FormControl("Seeker"),
    phone: new FormControl("",[Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]),
    dateofbirth:new FormControl("", [Validators.required,this.ageValidator]),
    education: new FormControl("",Validators.required),
    profile_pic: new FormControl(""),
    resume: new FormControl("")
    });

    selfEmployerForm = new FormGroup({
      selfEmployer_id:new FormControl('se'+uuidv4()),
      profilePhoto: new FormControl (''),
      name: new FormControl ('', Validators.required),
      fatherName: new FormControl ('', Validators.required),
      dob: new FormControl ('', Validators.required),
      email: new FormControl ('', [Validators.required, Validators.email]),
      mobile: new FormControl ('', Validators.required),
      role: new FormControl("selfEmployee"),
      address: new FormControl ('', Validators.required),
      aadhaarPhoto: new FormControl (''),
      communityCertificate: new FormControl (''),
      businessCategory: new FormControl ('', Validators.required),
      subBusinessCategory: new FormControl ('', Validators.required),
      skills: new FormControl ('', Validators.required)
    });
  // employee = new FormGroup({
  //   Name: new FormControl("", Validators.required),
  //   CompanyName: new FormControl("", Validators.required),
  //   email: new FormControl("", [Validators.email]),
  //   password: new FormControl("", [Validators.minLength(6),Validators.required]),
  //   phone: new FormControl("",Validators.required),
  // });
 trigger:boolean=false
 trigger1:boolean=true
  employee=this.fb.group({
    Name:['', [Validators.required,this.minLengthValidator(3),this.noSpacesAtStartOrEnd,Validators.pattern(/^[A-Za-z.]+( [A-Za-z.]+)*$/)]],
    CompanyName:['', [Validators.required,this.minLengthValidator(3),this.noSpacesAtStartOrEnd,Validators.pattern(/^[A-Za-z.]+( [A-Za-z.]+)*$/)]],
    email:['', [ Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),Validators.required,this.noSpacesAtStartOrEnd]],
    role: ["Company"],
    password:['',[Validators.required,Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/),this.noSpacesAtStartOrEnd]],
    phone:["",[Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
    street:["",[Validators.required,this.noSpacesAtStartOrEnd]],
    area:["",[Validators.required,this.noSpacesAtStartOrEnd]],
    pincode: ["",[Validators.required,Validators.pattern(/^[0-9]{6}$/)]],
    districtname: ["",[Validators.required,this.noSpacesAtStartOrEnd]],
    statename: ["",[Validators.required,this.noSpacesAtStartOrEnd]],
    Company_banner:[""],
    Company_logo:[""]
    // ,
    // products:['']
  })
  uscpass:any
  check(){
    var password = document.getElementById("confirmPassword") as HTMLInputElement;
    this.uscpass=password.value;
    if(this.uscpass!=='' && this.employee.valid){
      if(this.uscpass==this.functions.password.value){
        this.trigger=true
        this.trigger1=false
      }
    }
  }
  val:boolean=true
  my(event:any){

console.log(event.target.value);
let value=event.target.value
if(event.target.value.length==6){
  this.auth.GetByID("pincode","pincode",value).subscribe((xyz:any)=>{
    let data=xyz[0]
    console.log(xyz);

    this.employee.controls['districtname'].setValue(data.districtname)
    this.employee.controls['statename'].setValue(data.statename)
  })
}

  }
func5( role: string){
  let userType: string;

  if (role === "Seeker") {
    userType = "Seeker";
  } else if (role === "Company") {
    userType = "Company";
  } else {
    // Handle the case where role is neither "seeker" nor "employer"
    console.error("Invalid role:", role);
    return; // Do not proceed further
  }

  localStorage.setItem("userType", userType);
  this.router.navigateByUrl('auth/login');
console.log(this.regis.getRawValue());
let value=this.regis.getRawValue()
var phone:string =JSON.stringify(value.phone)
value.phone=phone
    //  this.http.post("http://127.0.0.1:8080/auth/seekers-info",)
     this.auth.save('seekers_info',value).subscribe({
      next: (data: any) => {
        console.log(data.message);
        this.router.navigate(['/auth/login']);
        this.snackbarService.showErrorMessage('Registration complete successfully as Seeker ');

      },error(err) {
          console.log(err);
          alert(err.message);

      }
     });
  }

  submitForm( role: string){
    let userType: string;

    if (role === "Seeker") {
      userType = "Seeker";
    } else if (role === "Company") {
      userType = "Company";
    } else {
      // Handle the case where role is neither "seeker" nor "employer"
      console.error("Invalid role:", role);
      return; // Do not proceed further
    }

    localStorage.setItem("userType", userType);
    this.router.navigateByUrl('auth/login');
  let value=this.employee.getRawValue()
  var phone:string =JSON.stringify(value.phone)
  value.phone=phone
  // this.http.post("http://127.0.0.1:8080/auth/seekers-info",value)
  this.auth.save('companies',value).subscribe({
    next: (data: any) => {
      console.log(data.message);
      this.router.navigate(['/auth/login']);
      this.snackbarService.showErrorMessage('Registration complete successfully as Employer ');


    },error(err) {
        console.log(err);
        alert(err.message);

    }
   });
  }
  selfEmployerSubmit( role: string){
    let userType: string;

    if (role === "Seeker") {
      userType = "Seeker";
    } else if (role === "Company") {
      userType = "Company";
    } else {
      userType = 'selfEmployer'
      // Handle the case where role is neither "seeker" nor "employer"
      // console.error("Invalid role:", role);
      ; // Do not proceed further
    }

    localStorage.setItem("userType", userType);
    this.router.navigateByUrl('auth/login');
  let value=this.selfEmployerForm.getRawValue()
  // var phone:string =JSON.stringify(value.phone)
  // value.phone=phone
  // this.http.post("http://127.0.0.1:8080/auth/seekers-info",value)
  this.auth.save('selfEmployer',value).subscribe({
    next: (data: any) => {
      console.log(data.message);
      this.router.navigate(['/auth/login']);
      this.snackbarService.showErrorMessage('Registration complete successfully as Employer ');


    },error(err) {
        console.log(err);
        alert(err.message);

    }
   });
  }

  func(){
  }

get first(){
  return this.regis.get('firstName');
}
get last(){
  return this.regis.get('lastName');
}
get emil(){
  return this.regis.get('email');
}
get emil1(){
  return this.employee.get('email');
}
get passwd(){
  return this.regis.get('password');
}
get phone(){
  return this.regis.get('phone');
  }
  get dob(){
  return this.regis.get('dateofbirth');
  }

get rolee(){
  return this.regis.get('role')
}
get functions(){
  return this.employee.controls
}
get functions1(){
  return this.regis.controls
}
get add(){
  return this.regis.get('address');
  }


func3( role: string) {
  let userType: string;

  if (role === "Seeker") {
    userType = "Seeker";
  } else if (role === "Company") {
    userType = "Company";
  } else {
    // Handle the case where role is neither "seeker" nor "employer"
    console.error("Invalid role:", role);
    return; // Do not proceed further
  }

  localStorage.setItem("userType", userType);
  this.router.navigateByUrl('auth/login');
}

onFileChange(event: any, controlName: any) {
  const inputElement = event.target as HTMLInputElement;

  if (inputElement && inputElement.files && inputElement.files.length > 0) {
    const file = inputElement.files[0];
    this.selfEmployerForm.get(controlName)?.setValue(file);
  }
}

onSubmit() {
  if (this.selfEmployerForm.valid) {
    // Handle form submission
    console.log(this.selfEmployerForm.value);
  }
}
// onSelectFile(event: any) {
//   if (event.target.files && event.target.files[0]) {
//     var reader = new FileReader();

//     reader.readAsDataURL(event.target.files[0]);

//     reader.onload = (event: any) => {
//       this.url = event.target.result;
//     }
//   }
// }

// handleFileUpload() {
//   const fileInput:any = document.getElementById('fileInput');
//   const file = fileInput.files[0];
//   let id =this.data._id
//      const formData = new FormData();
//   formData.append('file', file);
//   formData.append('seekers_id', id);
//   formData.append('category', 'profile_pic');

// console.log('====================================');
// console.log(formData);
// console.log('====================================');

//   // this.auth.fileUpload(formData).subscribe((res:any)=>{
//   //   console.log(res);

//   // })
//   this.auth.finalfileUpload(formData,id).subscribe((res:any)=>{
//     console.log(res);

//   })
// }
handleFileUpload(id: any, type?: any) {
  // debugger
  console.log(this.selfEmployerForm.value.selfEmployer_id);

  if (!this.selfEmployerForm || !this.selfEmployerForm.value.selfEmployer_id) {
    console.error("formValues or eventId is not available");
    return;
  }
  const newControl: any = this.fb.control("S3 key");

    this.selfEmployerForm.addControl(id, newControl);
    console.log(this.selfEmployerForm);
  const fileInput: any = document.getElementById(id);

  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    console.error("File input is not available or no files selected");
    return;
  }

  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('file', file);
  formData.append('data', this.selfEmployerForm.value.selfEmployer_id);
  formData.append('category', type);
  formData.append('collectionName', 'selfEmployer');
  this.auth.finalfileUpload(formData, 's3').subscribe((res: any) => {
    const newControl: any = this.fb.control(res["S3 key"]);

    this.selfEmployerForm.addControl(id, newControl);
    console.log(this.selfEmployerForm);

  })

}

onSelectFile(event: any, id?: any) {
  debugger
  if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]);
    console.log(id);

    if (id == 'profileLogo') {
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
    } else if(id=='aadhaarPhoto') {
      reader.onload = (event: any) => {
        this.url1 = event.target.result;
      }
  }else{
    reader.onload = (event: any) => {
      this.url2 = event.target.result;
  }
}
}
}
}
