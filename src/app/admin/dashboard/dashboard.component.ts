import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/service/search.service';
import {MatDialog, MatDialogConfig, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {


  details:any;
  logo:any
  value:any
  postedJobs:any
  jobId:any
  cards:any
  todayJob:any
  companyId:any
  appliedCandidate:any
  visitorLength:any


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private formService: FormService,
    private auth:ApiService,
    public dialog: MatDialog
    // private dialogService: DialogService,


  ) {

  }

  // openDialog() {
  //   const dialogConfig = new MatDialogConfig();
  // dialogConfig.autoFocus = true;
  // dialogConfig.width = '700px'; // Set the width here
  // // dialogConfig.height = '70vh'; // Set the height here

  // const dialogRef = this.dialog.open(DialogContentExampleDialog, dialogConfig);

  // dialogRef.afterClosed().subscribe(result => {
  //   console.log(`Dialog result: ${result}`);
  // });
  // }

  ngOnInit(): void {
    // this.dataservice.getparentdata('get-all-data-count').subscribe((res:any)=>{
    //   this.cards=res.data
    //   console.log( this.cards,"cardssssssssss")
    // })
// this.auth.GetByID
this.details=this.auth.getdetails()
console.log(this.details);

this.auth.getbyid("companies",this.details._id).subscribe((xyz:any)=>{
  console.log(xyz);
  if(xyz===null){
    this.visitorLength=0
  }
console.log(xyz.visitors);
this.visitorLength = xyz.visitors.length
this.visitorLength.length
console.log(this.visitorLength);

})
this.companyId = this.details.unique_id
console.log(this.companyId);

const filterValue: any = [
  {
    clause: "$and",
    conditions: [
      { column: "companyId", operator: "$eq", value: this.companyId},
    ]
  }
];
this.auth.getDataByFilter('jobs',filterValue).subscribe((abc:any)=>{
  console.log(abc);
  if(abc===null){
    this.postedJobs=0
  }else{
    this.postedJobs = abc.length
    console.log(this.postedJobs);
  }



      })
      this.companyId = this.details.unique_id
console.log(this.companyId);
       const filterValue1: any = [
        {
          clause: "$and",
          conditions: [
            { column: "companyId", operator: "$eq", value: this.companyId},
          ]
        }
      ];
      // console.log(filterValue1);

      this.auth.getDataByFilter('applied_jobs',filterValue1).subscribe((icf:any)=>{
        console.log(icf);
        if(icf===null){
          this.appliedCandidate=0
        }else{
          this.appliedCandidate = icf.length
          console.log(this.appliedCandidate);
        }



            })

            const startTime = moment().startOf('day').format();
            const endTime = moment().endOf('day').subtract(1, 'minute').format()
            console.log(startTime);
            console.log(endTime);

const filterValue2: any = [
        {
          clause: "$and",
          conditions: [
            { column: "companyId", operator: "$eq", value: this.companyId },
            { column: "createdOn", operator: "$gte", value:startTime ,type:"date"},
            { column: "createdOn", operator: "$lte", value:endTime ,type:"date"},
          ]
        }
      ];
      console.log(filterValue2);

      this.auth.getDataByFilter('applied_jobs',filterValue2).subscribe((res:any)=>{
        console.log(res);
        if(res==null){
          this.todayJob=0
          console.log(this.todayJob);
        }else{
          this.todayJob = res.length
          console.log(this.todayJob);
        }



            })

setTimeout(()=>{
  this.cards = [
    {
      count: this.visitorLength,
      text: 'Total visitor',
      icon: 'home',
      iconColor: 'blue',
      altText: 'Icon 1',
      height: '100px',
      width: '150px'
    },
    {
      count: this.postedJobs,
      text: 'Job Post',
      icon: 'work',
      iconColor: 'green',
      altText: 'Icon 2',
      height: '120px',
      width: '180px'
    },
    {
      count: this.appliedCandidate,
      text: 'Job Applied',
      icon: 'assignment',
      iconColor: 'red',
      altText: 'Icon 3',
      height: '110px',
      width: '160px'
    },
    {
      count: this.todayJob,
      text: 'Applicant today',
      icon: 'list',
      iconColor: 'orange',
      altText: 'Icon 4',
      height: '130px',
      width: '170px'
    },
  ];

},1000);

// console.log(this.cards);




  }



  getdata(){
    this.route.params.subscribe((params:any) => {
      console.log("HIIIIIII")
      this.auth.getbyid("user",params.id).subscribe((res:any)=>{
       let data= res.data
       console.log(data)
       this.logo= sessionStorage.setItem("company_logo",data.profileimage)
      })
  })
  }

page_route(url:any){
  this.router.navigate([`${url}`]);
}


}
// @Component({
//   selector: 'dialog-content-example-dialog',
//   // templateUrl: 'dialog-content-example-dialog.html',
//   template:`<style>
//   .main {
//   margin-bottom: 50px;
// }

// .bg {
//   font-family: 'Barlow';
// }

// img {
//   height: 100%;
//   width: 100%;
//   border-radius: 50%;
//   border: 1px solid transparent
// }

// .hoverable {
//   position: relative;
//   display: block;
//   cursor: pointer;
//   height: 150px;
//   width: 150px;
//   /* border: 1px solid rgba(144, 142, 142, 0.5); */
//   border-radius: 50%;
// }

// .hoverable .hover-text {
//   position: absolute;
//   display: none;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   z-index: 2;
//   font-size: 10px;
// }

// .hoverable .background {
//   position: absolute;
//   display: none;
//   top: 0;
//   left: 0;
//   bottom: 0;
//   right: 0;
//   background-color: rgba(255, 255, 255, 0.5);
//   pointer-events: none;
//   border-radius: 50%;
//   z-index: 1;
// }

// .hoverable:hover .hover-text {
//   display: block;
// }

// .hoverable:hover .background {
//   display: block;
// }

// #fileInput{
//   display: none;
// }
// </style>

// <mat-dialog-content class="mat-typography">
//   <!-- Existing content... -->

//   <!-- New form for Profile photo upload, Name, Email, and Phone number -->
//   <form style="overflow-y: hidden;height: 90vh;">
//     <div class="d-flex justify-content-center">
//     <h2> Add User Profile</h2>
//   </div>
//   <label >User's profile photo:</label>
//   <div class="d-flex justify-content-center">

//     <!-- Profile Photo Upload -->
//     <div class="text-center mb-3">
//       <div fxLayoutAlign="center center">
//         <label class="hoverable" for="fileInput">
//           <img [src]="url ? url : 'assets/image/no profile.png'" alt="User Profile">
//           <div class="hover-text">Upload User Profile</div>
//           <div class="background"></div>
//           <input id="fileInput" type='file' (change)="handleFileUpload()" (change)="onSelectFile($event)">
//         </label>
//       </div>
//     </div>
//   </div>
//     <!-- Name -->
//     <div class="form-group">
//       <label for="name">Name:</label>
//       <input type="text" class="form-control" id="name" name="name" required>
//     </div>

//     <div class="form-group">
//       <label for="description">User's short description</label>
//       <input type="text" class="form-control" id="description" name="description" required>
//     </div>

//     <!-- Email -->
//     <div class="form-group">
//       <label for="email">Email:</label>
//       <input type="email" class="form-control" id="email" name="email" required>
//     </div>

//     <!-- Phone Number -->
//     <div class="form-group">
//       <label for="phoneNumber">Phone Number:</label>
//       <input type="tel" class="form-control" id="phoneNumber" name="phoneNumber" required>
//     </div>
//   </form>

//   <!-- End of the new form -->

//   <!-- Remaining existing content... -->
// </mat-dialog-content>

// <mat-dialog-actions align="end">
//   <button mat-button mat-dialog-close style="color: white;" class="btn btn-secondary">Cancel</button>
//   <button mat-button [mat-dialog-close]="true" cdkFocusInitial style="background-color: var( --main-color);color: white;">Submit User</button>
// </mat-dialog-actions>
// `,
  
// })
// export class DialogContentExampleDialog {
//   url:any=null
//   constructor(private auth:ApiService){

//   }
//   handleFileUpload() {
//     const fileInput:any = document.getElementById('fileInput');
//     const file = fileInput.files[0];
//     // let id =this.data._id
//        const formData = new FormData();
//     formData.append('file', file);
//     // formData.append('data', id);
//     formData.append('category', 'profile_pic');
//   formData.append('collectionName', 'seekers_info');

// console.log('====================================');
// console.log(formData);
// console.log('====================================');

//     // this.auth.fileUpload(formData).subscribe((res:any)=>{
//     //   console.log(res);

//     // })
//     this.auth.finalfileUpload(formData,'s3').subscribe((res:any)=>{
//       console.log(res);

//     })
//   }
//   onSelectFile(event: any) {
//     if (event.target.files && event.target.files[0]) {
//       var reader = new FileReader();

//       reader.readAsDataURL(event.target.files[0]);

//       reader.onload = (event: any) => {
//         this.url = event.target.result;
//       }
//     }
//   }
// }
