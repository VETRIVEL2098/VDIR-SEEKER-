import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/search.service';

@Component({
  selector: 'app-image',
  template:`
  <style>

.card:hover{
  cursor: pointer;
}

.card-body {

  top: 0px;
  position: relative;

  background-color: #ffffff;
  border-radius: 4px;
  padding: 32px 24px;
  margin: 12px;
  text-decoration: none;
  z-index: 0;
  overflow: hidden;
  border: 1px solid #ffffff;
}

.card-body:hover {
  transition: all 0.2s ease-out;
  box-shadow: 0px 4px 8px rgba(38, 38, 38, 0.2);
  top: -4px;
  border: 1px solid #ffffff;
  background-color: white;
}

.card-body:before {
  content: "";
  position: absolute;
  z-index: -1;
  top: -16px;
  right: -16px;
  background:var(--main-color);
  height: 32px;
  width: 32px;
  border-radius: 32px;
  transform: scale(2);
  transform-origin: 50% 50%;
  transition: transform 0.15s ease-out;
}

.card-body:hover:before {
  transform: scale(2.15);
}

  </style>
  <div class="card-body" (click)="my(company)"  style="background-image: url({{company.Company_banner}});height:400px;
   background-repeat: no-repeat;background-size: cover;">

  <!-- <div class="card-body img-thumbnail" (click)="my(company)"  style="background-image: url({{company.Company_banner}})"> -->
<div class="text-center" style="float: left;margin-top: 10vh" >
  <img *ngIf="company.Company_logo" class="img-thumbnail"  src="{{ company.Company_logo }}" alt="Company Logo" style="width: 200px; height: 200px;background-color:var(--main-color)">
</div>
<div class="card" style="opacity: 0.7;  justify-content: end;width: 200px;float: right;margin-top: 10vh ">
  <div class="card-body">
    <div style="display: flex; flex-direction: column; align-items: flex-end;">
      <div style="font-size: 24px; font-weight: bold;">{{company.CompanyName}}</div>
      <h3 class="card-subtitle text-center">{{ company.industry }}</h3>
      <h4 class="card-text text-center">{{ company.description }}</h4>
      <div style="font-size: 16px; color: black;">
      <i class="fas fa-map-marker-alt"  style="color:var(--main-color)"></i>
        {{company.street}} {{company.area}} {{company.statename}} {{company.pincode}}
      </div>
    </div>
  </div>
</div>

</div>`
})
export class ImageComponent {
@Input('CompanyID') CompanyID:any={};
@Input('height') height:any;
@Input('width') width:any;
company:any

constructor(private auth: ApiService,private router:Router) {
  // this.auth.GetByID('companies','unique_id',this.CompanyID).subscribe((xyz:any)=>{
  //   console.log(xyz);
  //   this.company = xyz;
  // })
}

ngOnInit() {
  // console.log('sad');
  this.width=this.width? this.width : 800;
  this.height=this.height? this.height : 900;
  console.log(this.CompanyID);
  this.company=this.CompanyID;


}
my(abc:any){
console.log(abc);
console.log(abc.CompanyName);
console.log(abc.industry)
  // let industry =abc.industry
  // let CompanyName=abc.CompanyName

  // this.router.navigateByUrl(industry+'/'+CompanyName);
  let companyName=abc.CompanyName.replace(/ /g, "-");
let industry = abc.industry.replace(/ /g, "-");
console.log(companyName);
console.log(industry);


// console.log(id);

    this.router.navigateByUrl(industry+'/'+companyName)
}

}

