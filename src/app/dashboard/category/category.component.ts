import { Component, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from 'src/app/service/search.service';
import {MatTabsModule} from '@angular/material/tabs';
import { LayoutModule } from "../../shared/layout/layout.module";
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import slugify from 'slugify';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-category',
  standalone:true,
  imports:[CommonModule,MatTabsModule,LayoutModule,MatIconModule, RouterModule,ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {

companyflag:boolean=false
jobflag:boolean=false
industryFlag:boolean=false
showMapDiv = false;
mapdata:any
user:any
companies:any
latlong:any
loggedInBy:any=false
company:any
id:any
Checkvalue:any
Email:any;
apply:any
jobId: any;
job: any;
applied_job: any;
button: boolean = false;
profileVisitor: any = {};
isLoggedIn: boolean = false;
    logo:any;
    zoro: any;
    http: any;
    search_details: any;
    companyData: any = {};

jobFilter = false;
companyFilter = false;
industryFilter = false;

ngOnChanges(){
console.log(this.route);
}
ngOnInit() {
  // console.log('hi');
console.log(this.route);
this.applyJob()
}
    constructor(private auth: ApiService,private route :ActivatedRoute,private router:Router,private sharedService: SharedService) {
console.log(!!localStorage.getItem('token'));


      if(!!localStorage.getItem('token') == true){
        let visitor:any = localStorage.getItem('auth')

      let visitors = JSON.parse(visitor)
console.log(visitors);
      this.profileVisitor.visitors = this.profileVisitor.visitors || [];

      this.profileVisitor.visitors.push({
        firstName: visitors.firstName,
        email: visitors.email,
        address: visitors.address,
      });
      console.log(this.profileVisitor);
        }
       this.sharedService.dropdownValues$.subscribe(values => {
    console.log(values)
  });
  this.user=this.auth.decodeToken().role
  console.log(this.auth.decodeToken());

  console.log(this.user);


  this.sharedService.searchQuery$.subscribe(value => {
    console.log(value)
   });
      const params = this.route.snapshot.params;

      console.log(params);

      this.route.params.subscribe((xyz: any) => {
        const slugify = (text: string) => {
          return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        };

        const slugifiedParams: any = {};

        Object.keys(xyz).forEach(key => {
          slugifiedParams[key] = slugify(xyz[key] as string); // Type assertion here
        });

        console.log(slugifiedParams);
      });
      if (params['job'] && params['title'] || params['jobid']) {
        console.log('job screen');
  this.jobFilter=true;



  interface FilterCondition {
    clause: string;
    conditions: Condition[];
  }

  interface Condition {
    column: string;
    operator: string;
    value: string;
  }

  const inputCategory = params['business-category'];
  const inputCategory2 = params['company']
  const transformedCategory = inputCategory.replace('-', ' ');
  const transformedCategory2 = inputCategory2.replace('-', ' ');
  const filterValue1 : FilterCondition[] = [
    {
      clause: "$and",
      conditions: [
        { column: "industry", operator: "$eq", value: transformedCategory},
        { column: "CompanyName", operator: "$eq", value:transformedCategory2 },
        ]
    }
  ];



  this.auth.getDataByFilter('companies',filterValue1)
  .subscribe((xyz:any)=>{
    console.log(xyz[0]);

    this.companyData=xyz[0];
    // console.log( xyz[0].coordinate);

   this.latlong= xyz[0].coordinate

    // console.log(this.latlong);



    // this.jobflag=true
  })
  interface FilterCondition {
    clause: string;
    conditions: Condition[];
  }

  interface Condition {
    column: string;
    operator: string;
    value: string;
  }

  const input = params['title'];
  const title = input.replace(/-/g, ' ');
  console.log(title);
   // Replace hyphen with space

  const filterValue: FilterCondition[] = [
    {
      clause: "$and",
      conditions: [
        { column: "title", operator: "$eq", value: title },
        {column: "jobId", operator: "$eq", value:params['jobid']}
      ]
    }
  ];

  console.log(title);
  console.log(filterValue);
  this.auth.getDataByFilter('jobs',filterValue)
  .subscribe((xyz:any)=>{
    console.log(xyz);

    console.log(xyz[0]);
    this.job=xyz[0]


    this.jobflag=true
    this.auth.isLoggedIn().then((xyz: any) => {
      if (xyz) {
        const id = this.auth.getdetails()._id;
        interface FilterCondition {
          clause: string;
          conditions: Condition[];
        }

        interface Condition {
          column: string;
          operator: string;
          value: string;
        }

        const inputCategory = params['job'];
        const inputTitle = params['title'];

        const transformedCategory = inputCategory.replace(/-/g, ' ');
        const transformedTitle = inputTitle.replace(/-/g, ' ');

        const filterValue: FilterCondition[] = [
          {
            clause: "$and",
            conditions: [
              { column: "refid", operator: "$eq", value:  id},
              { column: "Jobid", operator: "$eq", value:transformedCategory },
              { column: "title", operator: "$eq", value:transformedTitle }
            ]
          }
        ];
        console.log(transformedCategory);
        console.log(transformedTitle);

        this.auth.getDataByFilter('applied_jobs', filterValue).subscribe((xyz: any) => {
          // console.log(xyz);
          if (xyz == null) {
            this.button = true;
          }
        });
      }
    });

    if (this.auth.decodeToken()) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  })

  // this.auth.GetByID("")
}
else if(params['business-category']&&params['company']){
  interface FilterCondition {
    clause: string;
    conditions: Condition[];
  }

  interface Condition {
    column: string;
    operator: string;
    value: string;
  }
  this.companyFilter=true;
  console.log(this.jobFilter,this.companyFilter,this.industryFilter);

  const inputCategory = params['business-category'];
  const inputCompany = params['company'];

  const transformedCategory = inputCategory.replace(/-/g, ' ');
  const transformedCompany = inputCompany.replace(/-/g, ' ');

  const filterValue: FilterCondition[] = [
    {
      clause: "$and",
      conditions: [
        { column: "industry", operator: "$eq", value: transformedCategory },
        { column: "CompanyName", operator: "$eq", value: transformedCompany }
      ]
    }
  ];

  console.log(transformedCategory);
  console.log(transformedCompany);

  // console.log("IT Services"==params['business-category']);

  // { 'business-category': 'IT services', company: 'Ban' }
  // console.log('company');



  this.auth.getDataByFilter('companies',filterValue)
  .subscribe((xyz:any)=>{
          console.log(xyz[0]);
          let id = xyz[0]._id
          console.log(id);


          // let address=xyz.street+" "+xyz.area+" "+xyz.statename+" "+xyz.pincode
          // let address = xyz.Address
          // let CompanyID=xyz._id

this.auth.updateVisitor("companies",id,this.profileVisitor).subscribe((xyz:any)=>{
  console.log(xyz);

})
          this.companyData=xyz[0]
          // this.mapdata=xyz[0].coordinate
          console.log(this.companyData.coordinate);

          console.log(this.companyData);

          let address= xyz.Address
          let CompanyID= xyz._id

          if(xyz.Company_Register_Type!=undefined&&xyz.Company_Register_Type!=null){
            xyz.Company_Register_Type=xyz.Company_Register_Type.replace(/_/g, ' ');
            console.log(xyz.Company_Register_Type);

          }else{
            xyz.Company_Register_Type=''
          }
          if(xyz.company_type!=undefined&&xyz.company_type!=null){
            xyz.company_type=xyz.company_type.replace(/_/g, ' ');
            console.log(xyz.Company_Register_Type);
          }else{
            xyz.company_type=''
          }
          if(xyz.estd_date==undefined&&xyz.estd_date==null){
            xyz.estd_date=''
            console.log(xyz.Company_Register_Type);
          }
          this.companyflag=true

    this.companyData['fulladdress']=address;
    console.log(this.companyData);



    const filtersValue: any = [
      {
        clause: "$and",
        conditions: [
          { column: "companyId", operator: "$eq", value: xyz[0].unique_id},
          { column: "status", operator: "$eq", value: "open" }
        ]
      }

    ];
    this.auth.getDataByFilter('jobs',filtersValue).subscribe((xyz:any)=>{
      console.log(xyz);
      this.search_details=xyz

    })

        })

}
else {
  interface FilterCondition {
  clause: string;
  conditions: Condition[];
}

interface Condition {
  column: string;
  operator: string;
  value: string;
}


this.industryFilter=true
const inputCategory = params['business-category'];
const transformedCategory = inputCategory.replace('-', ' ');

const filterValue: FilterCondition[] = [
  {
    clause: "$and",
    conditions: [
      { column: "industry", operator: "$eq", value: transformedCategory },
    ],
  },
];

console.log(transformedCategory); // Output the transformed category
console.log(filterValue);

   // { 'business-category': 'IT services', company: 'Ban' }
   this.auth.getDataByFilter('companies',filterValue)
   .subscribe((xyz:any)=>{
          //  console.log(xyz[0]);
           this.company=xyz[0];
           console.log(this.company);
           console.log(this.company.coordinate);



           this.industryFlag=true;

   })
}
    }
    my(abc:any){
      console.log(abc);
      let val=abc
      // let route = this.route.snapshot.params
      // console.log(route);


      // let id=parseInt(abc.jobId)
      const modifiedIndustry = val.industry.replace(/ /g, "-");
      const modifiedCompany = val.companyName.replace(/ /g, "-");
      const modifiedTitle = val.title.replace(/ /g, "-");
      const modifiedJobId = val.jobId
      console.log(modifiedJobId);



      const urlSegment = `${modifiedIndustry}/${modifiedCompany}/Jobs/${modifiedTitle}/${modifiedJobId}`;
      this.router.navigateByUrl(urlSegment);
        }
        routeback(){
          // this.router.navigateByUrl("dashboard/companies")
        }
        showMap() {
          this.showMapDiv = true;
        }
        hideMap() {
          this.showMapDiv = false;
        }
        zoro2 = new FormGroup({
          searchQuery : new FormControl("")

        })
        search1(){
          const abc:any = this.zoro2.value.searchQuery
          this.auth.GetByID('companies','CompanyName',abc,'true').subscribe({
            next: (data: any) => {
              console.log(data);
              this.companies = data;
            },
            error: (err: any) => {
              console.log(err);
              alert(err);
            }
          });
        }
        my1(abc:any){
          let val =abc
    let route = this.route.snapshot.params
    const modifiedValue = val.industry.replace(/ /g, "-");
    const modifiedCompany = val.CompanyName.replace(/ /g, "-");

    // this.route.navigateByUrl(modifiedValue)

          this.router.navigateByUrl(modifiedValue+"/"+modifiedCompany);
        }
        applyJob(){


          if(this.user=="Company"){
this.loggedInBy=false
          }else if(this.user=="seeker"){
            this.loggedInBy=true
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
          }




        }
        routeback1(data:boolean,id?:any){
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
        click(event:any){
          console.log(event);
          console.log(this.jobFilter,this.companyFilter,this.industryFilter);

          console.log('hi there');
          if(this.jobFilter){
console.log('job');

          }else if(this.companyFilter){
            console.log('Company');

          }else{
console.log('industry');

            this.industryFilter=true
          }


        }

   }
