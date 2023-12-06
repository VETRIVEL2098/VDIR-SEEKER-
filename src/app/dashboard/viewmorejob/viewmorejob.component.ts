import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/search.service';

@Component({
  selector: 'app-viewmorejob',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatIconModule],
  templateUrl: './viewmorejob.component.html',
  styleUrls: ['./viewmorejob.component.css'],
})
export class ViewmorejobComponent {
  isLoggedIn:any
  id:any
  applied_job:any
  button:any
  constructor(
    private auth: ApiService,
    private route: ActivatedRoute,
    private router:Router

  ) {
    this.route.params.subscribe(params=>{
      console.log(params);
      this.id=params['id'];
      this.auth.GetByID('jobs','jobId',this.id).subscribe({
        next: (data: any) => {
          console.log(data[0]);

          this.job = data[0];
          this.applied_job=this.job.applied_job
        },error(err) {
            console.log(err);
            alert(err.message);

        }
       });
       this.auth.isLoggedIn().then((xyz:any)=>{
        if(xyz){
          let details=this.auth?.getdetails()?._id
          const filterValue: any = [
           {
             clause: "$and",
             conditions: [
               { column: "Jobid", operator: "$eq", value:this.id },
               { column: "refid", operator: "$eq", value:details }
             ]
           }
         ];
         this.auth.getDataByFilter('applied_jobs',filterValue).subscribe((xyz:any)=>{
           console.log(xyz);

           if(xyz==null){
             this.button=true
           }

         })
        }
       })

      })

    if(this.auth.decodeToken()){
      this.isLoggedIn = true;
    } else{
      this.isLoggedIn = false;
    }
  }

  // ngOnInit(){
  //   this.auth.GetByID('jobs','jobId',this.id).subscribe({
  //     next: (data: any) => {
  //       console.log(data[0]);

  //       this.job =data[0];

  //     },error(err) {
  //         console.log(err);
  //         alert(err.message);

  //     }
  //    });

  // }
  job: any;
  search_details: any;
  Email:any;

  Checkvalue:any
  applyJob(){
    let button =document.getElementById("buttom") as HTMLButtonElement;
    button.disabled=true;
    this.button=false;
    let data = this.auth.getdetails();
    this.Email = this.auth.decodeToken().email;
    let date = new Date()
    console.log(this.job);
    let value =this.job
    const newData:any = {}
    newData.companyId= value.companyId
    let fname=data.firstName+ ' ' +data.lastName
    newData.name= fname
    newData.Company_name= value.companyName
    newData.title= value.title
    newData.education= data.education
    newData.Jobid =value.jobId
    newData.email= data.email
    newData.phone=data.phone
    newData.date= date
    newData.applied_type= 'New_Registration'
    // newData.phone=value.role
    newData.Location= value.Location
    newData.refid=data._id  // change in _id
    newData.role=value.role
    console.log(newData);
    // this.auth.postAppliedJobs
    this.auth.save('applied_jobs',newData).subscribe((xyz:any)=>{
      console.log(xyz);

      let applied_job:any={}
        let valu=(this.job.applied_job)+1
        applied_job['applied_job']=valu
        this.auth.update('jobs',this.job._id,applied_job).subscribe((last:any)=>{
          console.log(last);

        })


    });
    // this.auth.postAppliedJobs(newData).subscribe({
    //   next: (data: any) => {
    //     // console.log('====================================');
    //     console.log(data);
    //     // console.log('====================================');
    //     // alert(data.message);
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //   },
    // });


  }
  routeback(data:boolean,id?:any){
    if(data){
      this.router.navigateByUrl("dashboard/job-details")
    }else{
      this.router.navigateByUrl("dashboard/companies-info/"+id)

    }

  }
//dashboard/companies-info/
  login(params:any){
    if(params){
      this.router.navigate(['auth/register/seeker']);
    }else{
      this.router.navigate(['auth/login']);
    }
  }
}
