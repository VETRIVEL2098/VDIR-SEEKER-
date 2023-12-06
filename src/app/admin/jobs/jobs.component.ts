import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/search.service';
import { ColDef, FirstDataRenderedEvent, GridReadyEvent } from 'ag-grid-community';
import { ActionButtonComponent1 } from './action-button1';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';



@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent {
  Email:any

  companies:any;
  title:any;
  industry:any;
  description:any;
  company:any;
  location:any;
  salary:any;
  role:any;
  department:any;
  employmentType:any;
  jobDescription: any
  requirements: any
  formattedDate: any
  keySkills: any
  companyId:any
  jobId:any
  validity:any
  id:any
  button:boolean=false;
  validityFlag:boolean=false;
  len:any

  website:any
  rating:number[] = [20, 80];

  value:any
  arr:any[] = [];
sarlaryrange:any
rolerange:any
// job_Open_time:any
workmode:any
  fields:ColDef[]= [
		{
			"headerName": "Job ID",
			"field": "jobId",
			"filter": "agTextColumnFilter",
			"maxWidth":115
		},{
			"headerName": "Job Title",
			"field": "title",
			"filter": "agTextColumnFilter",
		},
		{
			"headerName": "Role",
			"field": "role",
			"filter": "agTextColumnFilter",
			"maxWidth":350
		},
		{
			"headerName": "Employment Type",
			"field": "employmentType",
			"filter": "agTextColumnFilter",
			"maxWidth":350
		}, {
			"headerName": "Job Validity Upto",
			"field": "validity",
		  }
      ,{
        "headerName": "Person Applied to Job",
        "field": "applied_job"
        },{
          "headerName": "Status Of Job",
          "field": "status"
          },{
        "headerName": "Action",
        "cellRenderer": "buttonRenderer"

        }
	]
  context:any
  frameworkComponents:any
  dropdownList:any[] = [];
  selectedItems:any[] = [];
  // job_closed_time:any
  dropdownSettings:IDropdownSettings = {
    singleSelection: false,
    idField: 'education',
    textField: 'education',
    // selectAllText: 'Select All',
    // unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,limitSelection: 3,
    allowSearchFilter: true
  };
  formControl:any
  editorConfig: AngularEditorConfig = {
    editable: true,
    height:"130px",
    // width:"200px",
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
formgrp=this.fb.group({
  title:['',[Validators.required]],
  role: ['',[Validators.required]],
  salary: ['',Validators.required],
  Location:[''],
  employmentType: ['',Validators.required],
  validity: ['',Validators.required],
  Education: ['',Validators.required],
  Description:[''],
  Requirements: [''],
  workmode:['',Validators.required],
  opening:['',[Validators.required,Validators.pattern(/^[0-9]+$/)]],
  // MinimumExperience:['',Validators.required],
  // MaximumExperience:['',Validators.required],
  Skill: [''],
  status:['open']
});
overlayNoRowsTemplate =
 '<span style="padding: 10px; background:white ;">No Data Found</span>"';
flag:boolean=false;
update_id:any
  constructor(private http: HttpClient, private auth:ApiService, private router: Router,private fb: FormBuilder,) {
    // this.Email =this.auth.decodeToken().email
    this.value=this.auth.getdetails()
    this.getAllJobslen().then(async(job:any)=> {
      this.jobId=  await job
    })
    // console.log(this.jobId);
    if(this.jobId==undefined|| this.jobId==null){
this.jobId=0
    }
    this.context = { componentParent: this };
    this.frameworkComponents = {
      buttonRenderer: ActionButtonComponent1,
    };

this.refrsh()
    this.auth.GetALL('salary').subscribe((abc2:any)=>{
      // console.log(abc2);
      this.sarlaryrange=abc2
    })
    this.auth.GetALL('education').subscribe((abc3:any)=>{
      this.dropdownList=abc3
      // console.log(this.dropdownList);


    })
    // change into
// let indisuty=this.auth.getdetails().industry
//     const filterValue: any = [
//       {
//         clause: "$and",
//         conditions: [
//           { column: "category", operator: "$eq", value:indisuty },
//         ]
//       }
//     ];
//     this.auth.getDataByFilter("industry",filterValue).subscribe((data:any)=>{
//       console.log(data[0].id);
//       let subid=data[0].id
//       const filterValue1: any = [
//         {
//           clause: "$and",
//           conditions: [
//             { column: "category_code", operator: "$eq", value:subid },
//           ]
//         }
//       ];
//       // For some thing it will not due to to data in databse
//       this.auth.getDataByFilter("role_category",filterValue1).subscribe((data:any)=>{
//         console.log(data);
//         this.rolerange=data
//       })
//     })
    // Changes
    this.auth.GetALL('role_category').subscribe((abc4:any)=>{
      // console.log(abc4);
      this.rolerange=abc4
      this.rolerange.sort((a:any, b:any) => a.category.localeCompare(b.category));



    })

    }


    view(data:any,event:any){
      this.flag=true
      this.button=true;
      let row=data
this.update_id=data
      let valid:Date=row.validity;
      console.log(valid);

      let date:any=this.formatMonthInNumber(row.CreatedOn)
      // let valu= Math.floor((Date.UTC(date.getFullYear(), date.getMonth(),
      //  date.getDate()) - Date.UTC(valid.getFullYear(), valid.getMonth(),
      //   valid.getDate()) ) /(1000 * 60 * 60 * 24));
      // console.log(valu);
      // console.log(this.formatMonthInNumber(row.CreatedOn));
      // console.log(date);


      // console.log(date.getTime());
      // console.log(valid.getTime());
      // let timeDifference=valid.getTime()- date.getTime()
      // console.log(Math.floor(timeDifference / (1000 * 60 * 60 * 24)));


      // this.update_id=row
      this.formgrp.controls['title'].setValue(row.title);
this.formgrp.controls['role'].setValue(row.role);
this.formgrp.controls['salary'].setValue(row.salary);
this.formgrp.controls['Location'].setValue(row.Location);
this.formgrp.controls['employmentType'].setValue(row.employmentType);
this.formgrp.controls['validity'].setValue(row.validity);
this.formgrp.controls['Education'].setValue(row.Education);
this.formgrp.controls['Description'].setValue(row.Description);
this.formgrp.controls['Requirements'].setValue(row.Requirements);
this.formgrp.controls['Skill'].setValue(row.Skill);
this.startval=row.MinimumExperience;
console.log(row.MinimumExperience);
console.log(row.MaximumExperience);
console.log(row.validity);

this.endval=row.MaximumExperience;
// this.formgrp.controls['status'].setValue(row.status);
this.formgrp.controls['opening'].setValue(row.opening);
this.formgrp.controls['workmode'].setValue(row.workmode);
this.formgrp.controls['status'].setValue(row.status);

    }
    onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.sizeColumnsToFit();
     }
     gridApi:any
     onGridReady(params: GridReadyEvent<any>) {
      this.gridApi = params.api;
    }
    public defaultColDef: ColDef = {
      resizable: true,
      suppressMovable:true,


    };
    updatevalue(data: any, data1: any) {
      // debugger
      let formValues: any = this.formgrp.getRawValue();
      console.log(formValues);

      let id = this.update_id._id;

      let originalValidity = formValues.validity
      console.log(originalValidity);

      if (data !== null) {
        const val1: number = parseInt(data);
        formValues.MinimumExperience = val1;
      }

      if (data1 !== null) {
        const val2: number = parseInt(data1);
        formValues.MaximumExperience = val2;
      }

      console.log(formValues.MinimumExperience);
      console.log(formValues.MaximumExperience);

      if (this.validityFlag == true) {

        let currentDate = moment();
        let newDate = moment(currentDate).add(formValues.validity, 'days');

        let formattedDate: string = newDate.format('YYYY-MM-DD');
        console.log(formattedDate);
        console.log(newDate);

        formValues.validity = formattedDate;
        console.log(formValues.validity);
        this.validityFlag = false;
      } else{
         formValues.validity = originalValidity.format('YYYY-MM-DD')
         console.log(formValues.validity);

      }
      this.auth.update('jobs', id, formValues).subscribe((xyz: any) => {
        // console.log(xyz);
        this.refrsh();
        this.formgrp.reset();
      });
    }


getAllJobslen() {

  return new Promise((resolve, reject) => {

  this.auth.getDataList('jobs').subscribe((xyz:any)=>{
    let value=xyz
    if(value!=null){
      let len:any=  (Object.keys(value).length)-1;
      var data:any= JSON.parse(value[len].jobId)
      if(data!=undefined||data!=null){
        // console.log(data);
        resolve(data)
      }else{
        resolve('1')
      }}
  });
})
}
rowselection:boolean=false
    onSelect(row:any) {
      row=row.api.getSelectedRows()[0]
      console.log(row);
      console.log(row.workmode);

this.formgrp.controls['title'].setValue(row.title);
this.formgrp.controls['role'].setValue(row.role);
this.formgrp.controls['salary'].setValue(row.salary);
this.formgrp.controls['Location'].setValue(row.Location);
this.formgrp.controls['employmentType'].setValue(row.employmentType);
this.formgrp.controls['validity'].setValue(row.validity);
this.formgrp.controls['Education'].setValue(row.Education);
this.formgrp.controls['Description'].setValue(row.Description);
this.formgrp.controls['Requirements'].setValue(row.Requirements);
this.formgrp.controls['Skill'].setValue(row.Skill);
this.formgrp.controls['workmode'].setValue(row.workmode);
this.formgrp.controls['status'].setValue(row.status);
// this.startval
// this.endval
}
    start(data:any,event:any){
      let id=data.jobId
      this.router.navigate(["admin/candidates/"+id],
      { queryParams: {role:data.role ,applied_job:data.applied_job,title:data.title } }
      )
    }

     formatMonthInNumber(dateString:any) {
      // console.log(dateString);

      const dateObj = new Date(dateString);
      // console.log(dateObj);

      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1; // Adding 1 since getMonth() returns 0 for January
      const date = dateObj.getDate();
    // console.log(date,month,year);
    let final = date+"-"+month+"-"+year
      // return `${date} ${"-"} ${month} ${"-"} ${year}`;
      return final
    }
emptyvalue(){
  this.formgrp.reset();
}
requirements1:any
my(){
  this.getAllJobslen().then(async(job:any)=> {
    this.jobId=  await job

  })
}
startval:number=0
endval:number=1
  logFormValues(data:any,data1:any) {
    // console.log(this.jobId);
    console.log('====================================');
    console.log(data);
    console.log(this.formgrp);

    console.log('====================================');
    if(this.formgrp.valid){

    var job_id=JSON.stringify(this.jobId+1)
    let cn=this.value.CompanyName
    let address:any
    // console.log(this.value.is_branch_available);

    if(!this.value.is_branch_available){
       address=(this.value.area +' '+ this.value.districtname + ' '+this.value.statename+ ' '+this.value.pincode)
      this.formgrp.controls['Location'].setValue(address);
    }

    this.formgrp.controls['status'].setValue('open');
    let formValues:any=this.formgrp.getRawValue()
    formValues.applied_job=0
    if(formValues.Location==''){
formValues.Location=this.value.area+ this.value.districtname +this.value.statename+ this.value.pincode
    }
    let days = JSON.parse(formValues.validity);
    console.log(days);

    let currentDate = moment();
    let newDate = moment(currentDate).add(days, 'days');

    let date: moment.Moment = newDate;
    console.log(date.format('YYYY-MM-DD')); // Output the formatted date if needed

    // let date=moment(newDate).toDate();
    //console.log(date.toString()); // Output: "date"
    formValues.refid=this.value._id
    // console.log(typeof(date));
    formValues.industry= this.value.industry
    formValues.Company_logo= this.value.Company_logo || ''
    formValues.companyId=this.value.unique_id
    formValues.companyName=cn
    formValues.city=this.value.districtname;
    formValues.jobId=job_id
    formValues.validity=date
    if(data==data1){
      const val1:number =JSON.parse(data)
      const val2:number =JSON.parse(data1)

      formValues.MinimumExperience=val1,
      formValues.MaximumExperience=val2
      console.log(formValues);

        this.auth.save('jobs',formValues).subscribe((xyz:any)=>{
          console.log(xyz);
          this.refrsh()
          this.formgrp.reset()
        })
    }else{
      const val1:number =JSON.parse(data)
      const val2:number =JSON.parse(data1)

      formValues.MinimumExperience=val1,
      formValues.MaximumExperience=val2
      if(this.formgrp.valid){
        console.log(formValues);

        this.auth.save('jobs',formValues).subscribe((xyz:any)=>{
          console.log(xyz);
          this.refrsh()
          this.formgrp.reset()
        })

      }

    }

    }
    // console.log(formValues.validity);
    // console.log(typeof(formValues.validity));
    // if(this.formgrp.valid){
    //   this.auth.save('jobs',formValues).subscribe((xyz:any)=>{
    //     console.log(xyz);
    //     this.refrsh()
    //     this.formgrp.reset()
    //   })

    // }


  }

refrsh(){
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
  // For some thing it will not due to to data in databse
  this.auth.getDataByFilter("jobs",filterValue1).subscribe((data:any)=>{
    // this.companies= data.map((xyz: any) => ({
    //     xyz.validitynew=this.formatMonthInNumber(xyz.validity)
    //    }))
    console.log(data);
    if(data!=null){
      this.companies = data.map((xyz: any) => ({
        ...xyz,
        validity: this.formatMonthInNumber(xyz.validity)
      }));
    }


  })
  // this.auth.GetByID('jobs','companyId',this.value.unique_id).subscribe((xyz: any) => {
  //   console.log(xyz);
  //   if(xyz != null || xyz != undefined){
  //     this.companies=xyz
  //     // xyz.forEach((element:any) => {
  //     //   if(element.jobId!=undefined){
  //     //     this.auth.GetByID('applied_jobs','jobid',element.jobid).subscribe((xyz:any) => {
  //     //       console.log(element.jobId);

  //     //       if(xyz != null){
  //     //         detail.element.jobid=xyz.length
  //     //       }else{
  //     //         detail.element.jobid=0
  //     //       }


  //     //     })
  //     //   }
  //     // })
  //   }})
}


}
