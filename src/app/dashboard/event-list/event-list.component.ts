import { HttpClient } from '@angular/common/http';
import { Component, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, FirstDataRenderedEvent, GridReadyEvent } from 'ag-grid-community';
import { Observable, map, startWith } from 'rxjs';
// import { constructor } from 'jasmine';
import { ActionButtonComponent1 } from 'src/app/admin/jobs/action-button1';
import { DialogService } from 'src/app/service/popup.service';
import { ApiService } from 'src/app/service/search.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {
  [x: string]: any;


  value:any
  companyId:any
  context:any
  gridOptions:any
  gridOptions1:any
  speakerid:any
  frameworkComponents:any
  sarlaryrange:any
  dropdownList:any[] = [];
  listContact:any[] = [];
  contactDetails:any[] = [];
  rolerange:any
  startval:number=0
  endval:number=1
  companies:any;
  location:any;
  imageList:any[] = [];
  image:any[] = [];
  button:boolean=false;
  flag:boolean=false;
  url:any = null;
  url1: any = null;
  url3: any = null;
  url4: any = null;
  flag1: boolean = true;
  flag2: boolean = true;
  update_id:any
  formValues: any;
  speakerValues:any;
  speakerForm: FormGroup | any;
  teamMemberForm: FormGroup | any;
  myControl = new FormControl('');
options: string[] = ['One', 'Two', 'Three'];
filteredOptions: Observable<string[]> | any;
  @ViewChild("speaker", { static: true }) speaker!: TemplateRef<any>;
  @ViewChild("teamMember", { static: true }) teamMember!: TemplateRef<any>;
  @ViewChild('agGrid') agGrid: AgGridAngular | any;
  @ViewChild('agGridTeam') agGridTeam: AgGridAngular | any;

  // this.dialogService.openDialog(this.userForm);
  speakerData: any = [];

  teamData: any = [];

  speakerColumnDefs: ColDef[] = [
    { headerName: 'Name', field: 'name'},
    { headerName: 'Email', field: 'email' },
    { headerName: 'Phone no', field: 'phoneNo' },
    { headerName: "Action", cellRenderer: "buttonRenderer" }
  ];

  teamColumnDefs: ColDef[] = [
    { headerName: 'Name', field: 'name'},
    { headerName: 'Email', field: 'email' },
    { headerName: 'Phone no', field: 'phoneNumber' },
    { headerName: "Action", cellRenderer: "buttonRenderer" }
  ];
  public defaultColDef: ColDef = {
    resizable: true,
    suppressMovable:true,


  };

  editorConfig: AngularEditorConfig = {
    editable: true,
    height:"130px",
    spellcheck: true,
    translate: 'yes',
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
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
   }
   gridApi:any
   onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
  }
  onFirstDataRendered1(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
   }
   gridApi1:any
   onGridReady1(params: GridReadyEvent<any>) {
    this.gridApi1 = params.api;
  }
  constructor(private http: HttpClient,public route: ActivatedRoute, private api:ApiService, private router: Router,private fb: FormBuilder,public dialogService:DialogService)
  {
    // this.dialogService.openSnackBar("OK","OK")
//     this.api.GetALL('user').subscribe((res:any)=>{
//       console.log(res);
// this.options=res
// this.filteredOptions = this.myControl.valueChanges.pipe(
//   startWith(''),
//   map((value:any) => this.filter(value.user_name || '')),
// );
//     })
this.api.GetALL('user').subscribe((res: any) => {
  console.log(res);
  this.options = res;
  this.filteredOptions = this.myControl.valueChanges.pipe(
    startWith(''),
    map((value: any) => this.filter(value || ''))
  );
});
   this.value=this.api.getdetails()
   console.log(this.value);
   this.companyId=this.value.unique_id
   console.log(this.companyId);

   this.route.params.subscribe((params:any)=>{
    if(params["id"]){
      this.edit(params["id"]);
      console.log(params);

    }
   })

   this.context = { componentParent: this };
   this.frameworkComponents = {
     buttonRenderer: ActionButtonComponent1,
   };
   this.context = { componentParent: this };
   }

 ngOnInit(){
  this.speakerForm = this.fb.group({
    speaker_id :[ 's' + uuidv4()],
    name: [''],
    description: [''],
    email: [''],
    phoneNo: [''],
    fullDescription: ['']
    // Add other form controls as needed
  });
  this.teamMemberForm = this.fb.group({
    teamMember_id :[ 't' + uuidv4()],
    name: [''],
    description: [''],
    email: [''],
    phoneNumber: [''],
    fullDescription: ['']
  });

}
filter(value: string): string[] {
//   const filterValue = value.toLowerCase();
// console.log(filterValue);

//   return this.options.filter((option:any) => {
//     let values:any=option;
//     console.log(values);
//     values.toLowerCase().includes(filterValue)
//   });
const filterValue = value.toLowerCase();
    console.log(filterValue);

    return this.options.filter((option: any) => {
      console.log(option);

      return option.user_name.toLowerCase().includes(filterValue);
    });
}
trackByFn(index:any, item:any) {
  return index; // or unique identifier if available
}

openPopup(data:any){
console.log(data);
 this.speakerid=data?._id
console.log(this.speakerid);

this.url4=data?.user_photo[0]
this.speakerForm.get("name").setValue(data?.user_name)
this.speakerForm.get("description").setValue(data?.description)
this.speakerForm.get("email").setValue(data?.email)
this.speakerForm.get("phoneNo").setValue(data?.phoneNo)
this.speakerForm.get("fullDescription").setValue(data?.fullDescription)

this.addSpeaker()
}
// openDialog(formData: any): void {
//   console.log(formData);
//   const value=Object.assign({
//     contact_name:formData.name,
//     contact_email:formData.contactemail,
//     event_role:formData.role,
//     phone_number:formData.phone

//   })
//   this.listContact = [...this.listContact,value];
//   this.contactDetails.push(value);
//   console.log(this.contactDetails);
//   // Refresh the grid by setting the updated rowData
//   this.gridOptions.api?.setRowData(this.listContact);


// }


onSubmit() {
  debugger
  // Log the form values in the console
  // console.log('Form values:', this.speakerForm.value);


let val:any = this.speakerForm.value
let id=this.update_id._id
console.log(id);

// const newControl = this.fb.control(res["S3 key"]);
// user_photo:this.speakerForm.addControl(id,newControl);
const speakers =
  {
    // speaker_id:  's' + uuidv4(),

    user_photo:val.speakerPhoto,
    user_name: val.name,
    description: val.description,
    email: val.email,
    phoneNo: val.phoneNo,
    fullDescription: val.fullDescription
  }

// const eventData = {
//   speaker: speakers,
// };
// this.api.update('event', id,eventData).subscribe((xyz: any) => {
//   console.log(xyz);
//   console.log("uploaded");


//   this.speakerForm.reset();
// })
let speakerId = this.speakerid
console.log(speakerId);

this.api.update('user',speakerId,speakers).subscribe((res:any)=>{
  console.log(res);
console.log('user Uploaded');

})
console.log(val);


this.speakerData=[...this.speakerData,this.speakerForm.value]
this.gridOptions.api?.setRowData(this.speakerData);

  // Optionally, you can clear the form after submitting


}
onSubmitTeamMember() {
  // Log the form values in the console
  let val:any = this.teamMemberForm.getRawValue()
  console.log('Form values:', this.teamMemberForm.value);
  // this.speakerData.push(this.teamMemberForm.value);
  this.teamData=[...this.teamData,this.teamMemberForm.value]
  this.gridOptions1.api?.setRowData(this.teamData);
  this.api.save('event',val).subscribe((xyz:any)=>{
    console.log(xyz);

  })
  // Optionally, you can clear the form after submitting
  this.teamMemberForm.reset();
}
   edit(id:any){
   console.log(id);

      this.api.getbyid('event',id).subscribe((row:any)=>{
      this.update_id=row
      this.button=true;
      console.log(row);
      this.formgrp.patchValue({
        mode: row.mode,
        Location: row.Location,
        Description: row.Description,
        address1: row.address1,
        status1: row.status1,
        startdate: row.startdate,
        enddate: row.enddate,
        time1: row.time1,
        duration: row.duration,
        eventName: row.eventName,
        opening: row.opening,
        fullDescription: row.fullDescription,
        contactName: row['primaryContact']['contactName'],
        email: row['primaryContact']['email'],
        phoneNumber: row['primaryContact']['phoneNumber'],
        role: row['primaryContact']['role']
      });
      this.url=row['eventLogo']
      this.url1=row['eventBanner']
    })
   }
  formgrp=this.fb.group({
    // _id:[uuidv4()],
    event_id :[ 'e' + uuidv4()],
    eventName: ['',Validators.required],
    mode:['',[Validators.required]],
    startdate: ['',Validators.required],
    enddate: ['',Validators.required],
    time1: ['',Validators.required],
    duration: ['',Validators.required],
    Description:[''],
    isRegisterMandatory: [false],
    address1:[''],
    Location:[''],
    opening:['',[Validators.required,Validators.pattern(/^[0-9]+$/)]],
    status1:['open'],
    contactName: [''],
    email: [''],
    phoneNumber: [''],
    role: [''],
    fullDescription:['']

  })

  emptyvalue(){
    this.formgrp.reset();
  }
  refrsh(){
    debugger
    this.endval=1
    this.startval=0
    console.log(this.value);
    const filterValue1: any = [
      {
        clause: "$and",
        conditions: [
          { column: "companyId", operator: "$eq", value:this.value.unique_id },
        ]
      }
    ];
  }
  eventbanner:any
  eventlogo:any

  handleFileUpload(id: any, type?: any) {
    debugger
    console.log(this.formgrp.value.event_id);

    if (!this.formgrp || !this.formgrp.value.event_id) {
      console.error("formValues or eventId is not available");
      return;
    }

    const fileInput: any = document.getElementById(id);

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      console.error("File input is not available or no files selected");
      return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('event_id', this.formgrp.value.event_id);
    formData.append('category', type);
    if(type=='speakerPhoto'){
      this.api.finalfileUpload(formData, id).subscribe((res: any) => {
        const newControl = this.fb.control(res["S3 key"]);

        this.speakerForm.addControl(id,newControl);
      });
    }else {
      this.api.finalfileUpload(formData, id).subscribe((res: any) => {
        const newControl = this.fb.control(res["S3 key"]);

        this.formgrp.addControl(id,newControl);

      })
    }


  }

  onSelectFile(event: any, type?: any) {
    debugger
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
      console.log(type);

      if (type == true) {
        reader.onload = (event: any) => {
          this.url = event.target.result;
        }
      } else {
        reader.onload = (event: any) => {
          this.url1 = event.target.result;
        }
      }
    }
  }
  onSelectFile2(event: any, type?: any) {
    debugger
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
      console.log(type);

      if (type == true) {
        reader.onload = (event: any) => {
          this.url3 = event.target.result;
        }
      } else {
        reader.onload = (event: any) => {
          this.url4 = event.target.result;
        }
      }
    }
  }

  logFormValues() {
    debugger;

    if (this.formgrp.valid) {
      // const eventId = 'e' + uuidv4();
      this.formValues = this.formgrp.getRawValue();
      // this.formValues.eventId = eventId;
      let id=this.formValues.event_id
      delete this.formValues.event_id
      let address:any
      if(!this.value.is_branch_available){
        address=(this.value.area +' '+ this.value.districtname + ' '+this.value.statename+ ' '+this.value.pincode)
       this.formgrp.controls['Location'].setValue(address);
     }
      this.formgrp.controls['status1'].setValue('open');
      this.formValues.primaryContact = {
        contactName: this.formgrp.get('contactName')?.value,
        email: this.formgrp.get('email')?.value,
        phoneNumber: this.formgrp.get('phoneNumber')?.value,
        role: this.formgrp.get('role')?.value,
      };
      if(this.formValues.Location==''){
        this.formValues.Location=this.value.area+ this.value.districtname +this.value.statename+ this.value.pincode
            }
      this.formValues.companyId = this.companyId;

      delete this.formValues.contactName;
      delete this.formValues.role;
      delete this.formValues.phone;
      delete this.formValues.email;
      console.log(id);
      console.log(this.formValues);

      this.api.update('event', id,this.formValues).subscribe((xyz: any) => {
        console.log(xyz);
        console.log("uploaded");

        this.refrsh();
        this.formgrp.reset();
          this.router.navigate(['admin/event']);
//         this.api.finalfileUpload(this.eventlogo, 'eventLogo').subscribe((res: any) => {
//           console.log(res);
//           formresponse.eventLogo=res["S3 key"]
//           this.eventbanner.append('event_id', xyz.InsertedID);
//           this.api.finalfileUpload(this.eventbanner, 'eventBanner').subscribe((res: any) => {
//             console.log(res);
//           formresponse.eventBanner=res["S3 key"]
// this.api.update('event', xyz.InsertedID,formresponse).subscribe((res: any) => {
//   console.log(res);

//   this.router.navigate(['admin/event']);
// })
          // });
        // });
      });
    }
  }
  showMapDiv = false;
  mapdata:any

  hideMap() {
    this.showMapDiv = false;
  }
  showMap() {
    this.showMapDiv = true;
  }
  click(event: any) {
    console.log(event);

    this.mapdata = {
      Latitude: event[0],
      Longitude: event[1]
    };
  }
  updatevalue() {
    debugger;

    let formValues: any = this.formgrp.getRawValue();
    console.log(formValues);

    let id = this.update_id._id;
    console.log(this.update_id);

    // const eventId = this.update_id.eventId;
    const originalContactName = formValues.contactName;
    const originalEmail = formValues.email;
    const originalPhoneNumber = formValues.phoneNumber;
    const originalRole = formValues.role;

    delete formValues.contactName;
    delete formValues.email;
    delete formValues.phoneNumber;
    delete formValues.role;

    formValues.primaryContact = {
      contactName: originalContactName,
      email: originalEmail,
      phoneNumber: originalPhoneNumber,
      role: originalRole,
    };

    this.api.update('event', id, formValues).subscribe((xyz: any) => {
      console.log("list", xyz);
  this.router.navigate(['admin/event']);
  // this.formgrp.reset();
    });
  }

  cancelButtonClick() {

    this.router.navigate(['admin/event']);
  }
  addSpeaker(){
    this.dialogService.openDialog(this.speaker)
  }
  addTeamMember(){
    this.dialogService.openDialog(this.teamMember)
  }
  uploadFiles() {
    debugger
    var formData = new FormData();



    for (const file of this['image']) {
      formData.append("file", file);

    }

    // console.log(this.selectedAppModel.app_code);

    // this.dataservice.postData("application/image/" + this.selectedAppModel.app_code, formData).subscribe((res: any) => {
    //   if (res.success == 1) {
    //     // this.files = this.files.concat(res.data)
    //     // this.files = [...this.files]
    //     this.dialogService.openSnackBar("Image has been uploaded successfully", "OK")

    //   } else {
    //     alert('Error')
    //   }
    // })


  }
//* UPLOADED IMAGE and  IMAGE resize
  onFileSelection(event: any) {
    for (const file of event.target.files) {
      console.log(event.target,"target");
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = 250; // desired width
            canvas.height = 250; // desired height
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const resizedImage = canvas.toDataURL('image/jpeg'); // you can change the image format if needed
            this.imageList.push(resizedImage);
            this.image.push(file);
            console.log(this.imageList,"image");
          } else {
            console.error('Failed to get canvas context');
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
removeSelectedFile(index: any) {
    this.imageList.splice(index, 1);
  }


}
