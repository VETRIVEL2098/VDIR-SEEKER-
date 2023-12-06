import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/search.service';
import {MatTabsModule} from '@angular/material/tabs';
import { LayoutModule } from "../../shared/layout/layout.module";
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-cvbuilder',
  standalone:true,
  imports:[CommonModule,MatTabsModule,LayoutModule,MatIconModule],
  templateUrl: './cvbuilder.component.html',
  styleUrls: ['./cvbuilder.component.css']
})
export class CvbuilderComponent {
  logo:any;
  zoro: any;
  http: any;
  search_details: any;
  companyData: any = {};
  constructor(private auth: ApiService,private route :ActivatedRoute,private router:Router) {
    const id = this.route.snapshot.params['id'];
    this.auth.getbyid('companies',id).subscribe((xyz:any)=>{
      console.log(xyz.CompanyName);
      let address=xyz.street+" "+xyz.area+" "+xyz.statename+" "+xyz.pincode
      console.log(address);
      this.companyData=xyz
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

this.companyData['fulladdress']=address;
console.log(this.companyData);

const filterValue: any = [
  {
    clause: "$and",
    conditions: [
      { column: "companyId", operator: "$eq", value: xyz.unique_id},
      { column: "status", operator: "$eq", value: "open" }
    ]
  }
];
this.auth.getDataByFilter('jobs',filterValue).subscribe((xyz:any)=>{
  console.log(xyz);
  this.search_details=xyz

})

    })

  }
  my(abc:any){
    console.log(abc);
    let id=parseInt(abc.jobId)
    console.log(id);

        // this.router.navigateByUrl(`dashboard/viewmorejob/`+id)
      }
      routeback(){
        this.router.navigateByUrl("/companies")
      }

 }

