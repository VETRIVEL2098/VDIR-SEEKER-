import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/search.service';

@Component({
  selector: 'app-candidate-info',
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule,MatIconModule ],
  templateUrl: './candidate-info.component.html',
  styleUrls: ['./candidate-info.component.css']
})
export class CandidateInfoComponent {
  userDetails:any;
  parms:any;
  resumeHere:boolean=false;
  overall_data:any[]=[]

  constructor(private http: HttpClient, private auth:ApiService,private route: ActivatedRoute,private router:Router) {
    this.route.queryParamMap.subscribe((params:any)=>{ // queryparams
      this.parms = params.params;
      console.log(this.parms.applied_type);
    })
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];

    const data: any[] = [];
    const data1: any[] = [];

    this.auth.GetByID('seekers_info', '_id', id,'false').subscribe((res: any) => {
      console.log(res);


      data.push(res[0]);
      console.log(res[0].resume);
      if(res[0].resume!=null){
this.resumeHere=true
      }else{
this.resumeHere=false
      }

       console.log(id);

    const filterValue: any = [
      {
        clause: "$and",
        conditions: [
          { column: "_id", operator: "$eq", value:id },
        ]
      }
    ];
    this.auth.getDataByFilter('user_resume',filterValue).subscribe((res:any)=>{
      console.log(res);

    // })
        console.log(res[0]);
        if(res!=null){
          data1.push(res[0]);
          this.overall_data = this.groupData(data, data1);

        }else{
          this.overall_data = this.groupData(data);
        }


        console.log(this.overall_data);
        // if( this.overall_data){

        // }else{

        // }

      });
    });
  }

groupData(data: any[], data1?: any[]):any[] {
  console.log(data);
  console.log(data1);


  const groupedData: any[] = [];
  if (data1 == null) {
    data.forEach((item) => {
      groupedData.push({
        candidateInfo: item,
        resumeData: null, // You can set this to null when resume data is not available
      });
    });
  } else {
    console.log(data1);
    data.forEach((item) => {
      const matchingData = data1.find((dataItem) => dataItem._id === item._id);
      if (matchingData) {
        groupedData.push({
          candidateInfo: item,
          resumeData: matchingData,
        });
      }
    });
  }
console.log(groupedData);

  return groupedData;
}

UpdateCanditeInfo(type:any){
console.log(type);
let data:any={}
data['applied_type']=type;
console.log(this.overall_data);
console.log(this.parms);
let value =this.parms.Jobid
console.log(value);

this.auth.GetByID('applied_jobs','Jobid',value).subscribe((xyz:any)=>{
  console.log(xyz);

let ID =xyz[0]._id
this.auth.update('applied_jobs',ID,data).subscribe((val:any)=>{
console.log(val);
})
this.router.navigateByUrl("admin/candidates/all",value)
})


}
routeback(){
  console.log(this.parms);

  this.router.navigate(["admin/candidates/"+this.parms.Jobid]);
}
}

