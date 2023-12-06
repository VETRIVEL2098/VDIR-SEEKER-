import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/search.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent {
  overalldisable:boolean=true
  productradio:any
  imp_expt_present:any
  do_you_need_help_pf:any
  registered_in_Goverment:any
  GSTradio:any
  exportradio:any
  data: any
  auth: any
  value: any = {}
  flag: boolean = true
  url: any = null;
  url1: any = null;
  toast: boolean = false;
  Cin: boolean = false;
  Help1: boolean = false;
  Help: boolean = false;
  GSt: boolean = false;
  export: boolean = false;
  Company_logo: string[] = [];
  Company_banner: File[] = [];
  serviceRow: string = '';
  flag1: boolean = true;
  flag2: boolean = true;
  val: any
  business:any = {
    manufacturers: false,
    exporters: false,
    services: false,
  };
  services: boolean = false;
  productRows: any[] = [];
  serviceRows: any[] = [];
  serviceName:any;
  editMode = false;
  editMode1 = true;
  editMode2 = true;
  editMode3 = false;
Address:any;
noSpacesValidator = (control: FormControl) => {
  if (control.value && (control.value.trim().length === 0 || control.value.trim() !== control.value)) {
    return { noSpaces: true };
  }
  return null;
};
futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      return { 'futureDate': true };
    }

    return null;
  };
}
  firstFormGroup = this.formBuilder.group({
    Company_Register_Type: ['', Validators.required], // Add Validators.required for mandatory field
    company_type: ['', Validators.required], // Add Validators.required for mandatory field
    industry: ['', Validators.required], // Add Validators.required for mandatory field
    estd_date: ['',[Validators.required,this.futureDateValidator()]], // You can add validation for date if needed
    pan_no: ['', [Validators.required]], // PAN number validation
    aadhaar_no: ['', [Validators.required,]] // Aadhaar number validation
  });
  branch:boolean=false;
  secondFormGroup = this.formBuilder.group({
    // gst_no_present:[''],
    is_branch_available: [''],
    gst_no: ['', Validators.pattern(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/)],
    // imp_expt_present:[''],
    branch:['',Validators.required],
    iec_no: [''],
    Corporate_Identity_Number: [''],
    do_you_need_help_pf: [''],
    pf_no: [''],

  });
  // thirdFormGroup = this.formBuilder.group({
  //   // help_pf:[''],
  //   do_you_need_help_pf: [''],
  //   pf_no: [''],
  //   // website: [''],
  // });
  editorConfig: AngularEditorConfig = {
    editable: true,
    height:"130px",
    // width:"200px",
    spellcheck: true,
    translate: 'yes',defaultFontSize:'3',
     fonts: [
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'}
    ],
    toolbarHiddenButtons :[
            [
              'customClasses',
              'insertImage',
              'insertVideo',
              'removeFormat','underline','heading','insertHorizontalRule','link',    'insertOrderedList',
              'toggleEditorMode','bold', 'italic','strikeThrough','backgroundColor','textColor','textColor','unlink','fontSize'
            ]
          ]

  }
  basicinfo=this.formBuilder.group({
    Name: ['', [Validators.required,this.noSpacesValidator]],
    CompanyName: ['',[ Validators.required,this.noSpacesValidator]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    email: ['', [Validators.required, Validators.email]],
    emp_count: ['', Validators.required],
    Website: ['', [Validators.required, Validators.email]],
    Address: ['', [Validators.required]],
    company_description: ['']
  })
imgfalg:boolean=true;

  constructor(private formBuilder: FormBuilder, private Api: ApiService, private router: Router) {
    this.auth = this.Api.getdetails();
    this.toggleEditMode();
    this.toggleEditMode1();
    this.toggleEditMode2();
    this.toggleEditMode3();
    // console.log(this.auth.phone);
    this.basicinfo.controls['Name']?.setValue(this.auth.Name);
    this.basicinfo.controls['CompanyName'].setValue(this.auth.CompanyName);
    this.basicinfo.controls['Address'].setValue(this.auth.area +','+' '+this.auth.districtname+','+' '+ this.auth.statename +','+' '+this.auth.pincode)
    this.basicinfo.controls['email'].setValue(this.auth.email)
    if (this.auth.phone != '') {
      let data = JSON.parse(this.auth.phone);
      this.basicinfo.controls['phone'].setValue(data);
    }
    this.Api.GetALL('industry').subscribe((xyz: any) => {
      console.log(xyz);
      this.data = xyz;
    })
    this.Api.getbyid('companies',this.auth._id).subscribe((data: any) => {
      // debugger
      console.log(data);
      let value =data;
      this.value = value;
      this.url = value?.Company_logo

      this.url1 = value?.Company_banner
      // Set values for firstFormGroup
      if (value != null && value.update_on) {
        console.log(value.gst_no);
        this.val = true
        if (value.gst_no != " ") {
          this.GSTradio=true
          this.GSt = true;
        }
        else {
          this.GSTradio=false;
          this.GSt = false;
        }
        if (value.pf_no != " ") {
          this.Help = true
          this.imp_expt_present=true
        } else {
          this.imp_expt_present=false
          this.Help = false;
        }
        console.log(value.iec_no);

        if (value.iec_no != "") {
          this.exportradio=true
          this.export = true
        } else {
          this.exportradio=false;
          this.export = false;
        }

        if (value.Corporate_Identity_Number != " ") {
          this.registered_in_Goverment=true;
          this.Cin = true
        } else {
          this.registered_in_Goverment=false;
          this.Cin = false;
        }

        if (value.do_you_need_help_pf) {
          this.Help1 = true
        } else {
          this.Help1 = false
        }

        if (value.is_branch_available=='true') {
          this.branch= true
        } else {
          this.branch= false
        }

        if (value.business.manufacturers) {
          this.product=true
        } else {
          this.product= false
        }
        console.log(value.coordinate);
        console.log(value);

        if(value.coordinate){
          let coordiate=value.coordinate
    this.mapdata = {
      Latitude: coordiate.Latitude,
      Longitude: coordiate.Longitude

    };
    console.log(this.mapdata);

        }
        this.firstFormGroup.controls['Company_Register_Type']?.setValue(value.Company_Register_Type);
        this.firstFormGroup.controls['company_type']?.setValue(value.company_type);
        this.firstFormGroup.controls['industry']?.setValue(value.industry);
        this.firstFormGroup.controls['estd_date']?.setValue(value.estd_date);
        console.log(typeof(value.is_branch_available));
        this.business=value.business;
        this.secondFormGroup.controls['is_branch_available']?.setValue(value.is_branch_available);
        // this.firstFormGroup.controls['website']?.setValue(value.website);
        // this.firstFormGroup.controls['email']?.setValue(value.email);

        // this.firstFormGroup.controls['phoneNo'].setValue(value.phoneNo);
        // this.firstFormGroup.controls['Registered_with_govt'].setValue(value.Registered_with_govt);
        this.secondFormGroup.controls['Corporate_Identity_Number']?.setValue(value.Corporate_Identity_Number);
        // this.secondFormGroup.controls['help_Registered_PF'].setValue(value.help_Registered_PF);
        // this.secondFormGroup.controls['gst_no_present'].setValue(value.gst_no_present);
        this.secondFormGroup.controls['gst_no']?.setValue(value.gst_no);
        this.firstFormGroup.controls['pan_no']?.setValue(value.pan_no);
        this.firstFormGroup.controls['aadhaar_no']?.setValue(value.aadhaar_no);
        // this.secondFormGroup.controls['imp_expt_present'].setValue(value.imp_expt_present);
        this.secondFormGroup.controls['iec_no']?.setValue(value.iec_no);
        // this.thirdFormGroup.controls['help_pf'].setValue(value.help_pf);
        this.secondFormGroup.controls['branch']?.setValue(value.branch);

        this.secondFormGroup.controls['do_you_need_help_pf']?.setValue(value.do_you_need_help_pf);
        this.secondFormGroup.controls['pf_no']?.setValue(value.pf_no);
        // this.thirdFormGroup.controls['website'].setValue(value.website);
        console.log(value.Name);

        this.basicinfo.controls['Name']?.setValue(value.Name);
        this.basicinfo.controls['CompanyName'].setValue(value.CompanyName);
        this.basicinfo.controls['email'].setValue(value.email);
        this.basicinfo.controls['company_description'].setValue(value.company_description);
        this.basicinfo.controls['Website'].setValue(value.Website);
        this.basicinfo.controls['emp_count'].setValue(value.emp_count);
        this.basicinfo.controls['phone'].setValue(value.phone);
      }
    })
    this.productRows.push({
      productName: '',
      productDescription:''
      // Add any additional fields for the product here, if needed
    });
    this.serviceRows.push({
      serviceName: '',
      serviceDescription:''
    });
    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.basicinfo.valid) {
      this.toast = true;
    }
    this.toggleEditMode()

  }


  addProductRow() {
    this.productRows.push({
      productName: '',
      productDescription:''
    });
  }
  addServiceRow() {
    // Add the entered service name to the array
    this.serviceRows.push({
      serviceName: '',
      serviceDescription:''
    });
  }

  deleteServiceRow(index: number) {
    // Remove the service name from the array using the provided index
    this.serviceRows.splice(index, 1);
  }

  // formData.append('file', file);
  // formData.append('data', this.selfEmployerForm.value.selfEmployer_id);
  // formData.append('category', type);
  // formData.append('collectionName', 'selfEmployer');
  // this.auth.finalfileUpload(formData, 's3').subscribe((res: any) => {
  //   const newControl: any = this.fb.control(res["S3 key"]);

  //   this.selfEmployerForm.addControl(id, newControl);
  //   console.log(this.selfEmployerForm);


  handleFileUpload(id: any, type?: any) {
    const fileInput: any = document.getElementById(id);
    const file = fileInput.files[0];
    let _id = this.auth._id;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', _id); //seekers or company id
    formData.append('category', type);
    this.Api.finalfileUpload(formData, 's3').subscribe((res: any) => {
      console.log(res);

    })
  }
  mapdata:any

  click(event: any) {
    console.log(event);

    this.mapdata = {
      Latitude: event[0],
      Longitude: event[1]
    };
  }


  onSelectFile(event: any, type?: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
      if (type) {
        reader.onload = (event: any) => {
          this.url = event.target.result;
          this.flag1 = false;
        }
      } else {
        reader.onload = (event: any) => {
          this.url1 = event.target.result;
          this.flag2 = false;
        }
      }
    }
  }
  showMapDiv = false;

  showMap() {
    this.showMapDiv = true;
  }

  hideMap() {
    this.showMapDiv = false;
  }
  display() {
    this.flag = false;
  }
  product1:boolean=false;
  my(value: any, type: string) {
    console.log(type);


    if (type == "Cin") {

      if (value) {
        this.Cin = true

      } else {
        this.Cin = false

      }
    } else if (type == "GSt") {
      if (value) {
        this.GSt = true

      } else {
        this.GSt = false

      }
    } else if (type == "export") {
      if (value) {
        this.export = true

      } else {
        this.export = false

      }

    } else if (type == "pf") {
      if (value) {
        this.Help = true
        this.Help1 = false


      } else {
        this.Help = false

        this.Help1 = true

      }

    }
//     else if (type == "exporters || manufacturers ") {
//       if (value) {
// this.product1 = true

//       } else {
//         this.product1 = false
//       }

//     }
    else if (type == "branch") {
      console.log(value);

      if (value) {
this.branch = true

      } else {
        this.branch = false
      }


    }

  }
   a=false
  my2(value: any){
    if (value == "exporters" || value == "manufacturers" ) {
      if (value) {
        this.product1 = true;
      } else {
        this.product1 = false;
      }
    }
    if (value == "services") {

        this.a = true;
      } else {
        this.services = false;
      }
    }


  submitForm() {
    // debugger
  //  if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.basicinfo.valid) {
    let value:any  ={}
    value['business']=this.business;
    // let formValues = {}
    // if(this.serviceRows.length!==0){
    //   if(this.serviceRows.length!==0){
    //     formValues = {
    //       ...this.firstFormGroup.value,
    //       ...this.secondFormGroup.value,
    //       ...this.basicinfo.value,
    //       ...value,
    //       ...this.productRows,
    //       ...this.serviceRows
    //     };
    //   }else{
    //     formValues = {
    //       ...this.firstFormGroup.value,
    //       ...this.secondFormGroup.value,
    //       ...this.basicinfo.value,
    //       ...value,
    //       ...this.productRows
    //     };

    //   }
    // }else{
    //   formValues = {
    //     ...this.firstFormGroup.value,
    //     ...this.secondFormGroup.value,
    //     ...this.basicinfo.value,
    //     ...value,
    //     ...this.productRows,
    //     ...this.serviceRows
    //   };

    // }
    console.log(this.productRows);
    let product:any={}
    product['product']= this.productRows
    console.log(product);

    let service:any={}
    service['service']=this.serviceRows
console.log(service);
let coordinate:any=this.mapdata
console.log(coordinate);
   let formValues = {      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.basicinfo.value,
      ...value,
      ...service,
      ...product
    };
    console.log(coordinate);

    formValues['coordinate']=coordinate;
      if(typeof(formValues.phone)!='string'){
        formValues.phone = JSON.stringify(formValues.phone);
      }

      console.log(formValues);
      // if (this.value == formValues) {
      //   console.log("No Value CHANGE");

      // }
      this.Api.update('companies', this.auth._id, formValues).subscribe((xyz: any) => {
        localStorage.removeItem('auth');
        this.Api.GetByID('companies', "unique_id", this.auth.unique_id).subscribe((data: any) => {
          let value = data[0];
          this.Api.storedToken(value, true)
        })
      })
    // }
    //undo
  // console.log(this.productRows,'rows');
  // console.log(this.business);



  }
  stopPropagation(event:any){
    event.stopPropagation();
  }

  get functions1() {
    return this.firstFormGroup.controls
  }
  get functions3() {
    return this.basicinfo.controls
  }

  get functions2() {
    return this.secondFormGroup.controls
  }
  product:boolean=false
Product(event:any){
let input =document.getElementById("Manufacturers")as HTMLInputElement
console.log(event);
console.log(input);
if(this.product==false){
  this.product=true;
  console.log(event,'true');

}else{
  this.product=false;
  this.product1=false;
  console.log(event,'tr');
}

console.log(input.value);

}
// formData.append('file', file);
// formData.append('data', this.selfEmployerForm.value.selfEmployer_id);
// formData.append('category', type);
// formData.append('collectionName', 'selfEmployer');
// this.auth.finalfileUpload(formData, 's3').subscribe((res: any) => {
//   const newControl: any = this.fb.control(res["S3 key"]);

//   this.selfEmployerForm.addControl(id, newControl);
//   console.log(this.selfEmployerForm);

handleFileUpload1(event: any, index: number) {
  const file = event.target.files[0];
  let _id = this.auth._id;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('data', _id); //seekers or company id
  formData.append('category', 'product');
  // this.Api.finalfileUpload(formData).subscribe((res: any) => {
  //   // Save the uploaded image URL to the product row
  //   this.productRows[index].productImage = res.fileUrl;
  // });
}

onSelectFile1(event: any, index: number) {
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.productRows[index].productImage = event.target.result;
    };
  }
}

deleteProductRow(index: number) {
  // Remove the image URL when the product row is deleted
  const imageUrl = this.productRows[index].productImage;
  if (imageUrl) {
    // Implement logic to delete the image file from the server if needed
    // (Make an API call to delete the image using the URL)
    // Example: this.Api.deleteFile(imageUrl).subscribe(...);
  }
  this.productRows.splice(index, 1);
}
toggle:boolean=false
// toggleEditMode(data?:any) {
//   this.editMode = !this.editMode;
//   if (this.editMode) {
//     this.basicinfo.enable();
//     this.firstFormGroup.enable();
//     this.secondFormGroup.enable();
//     this.toggle=true;
//   } else {
//     if(this.toggle){this.submitForm();}
//     this.basicinfo.disable();
//     this.firstFormGroup.disable();
//     this.secondFormGroup.disable();
//   }
// }
toggleEditMode() {
  this.editMode = !this.editMode;
  if (this.editMode){
    this.basicinfo.enable();
  }
  else{
this.basicinfo.disable()
  }
}
toggleEditModeIcon() {
  this.imgfalg = !this.imgfalg;
}
saveValues() {
  this.submitForm()
  this.toggleEditMode();
}
toggleEditMode1() {
  this.editMode1 = !this.editMode1;
  if (this.editMode1){
    this.firstFormGroup.enable();
  }
  else{
this.firstFormGroup.disable()
  }
}

saveValues1() {
  this.submitForm()
  this.toggleEditMode1();
}
toggleEditMode2() {
  this.editMode2 = !this.editMode2;
  if (this.editMode2){
    this.secondFormGroup.enable();
  }
  else{
this.secondFormGroup.disable()
  }
}

saveValues2() {
  this.submitForm()
  this.toggleEditMode2();
}
toggleEditMode3() {
  this.editMode3 = !this.editMode3;
}

saveValues3() {
  this.submitForm()
  this.toggleEditMode3();
}
goBack(): void {
  // this.location.back();s
  this.router.navigate(['admin/preview-profile']);
}
}
