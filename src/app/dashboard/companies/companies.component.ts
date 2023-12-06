import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/service/search.service';
import { LayoutModule } from "../../shared/layout/layout.module";
import { SharedService } from 'src/app/service/shared.service';

@Component({
    selector: 'app-companies',
    standalone: true,
    templateUrl: './companies.component.html',
    styleUrls: ['./companies.component.css'],
    imports: [CommonModule, ReactiveFormsModule, LayoutModule]
})
export class CompaniesComponent {
city:any;
companyName:any;
  constructor(private route: ActivatedRoute,private http: HttpClient, private auth: ApiService,private router:Router,private sharedService: SharedService ) {

    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length === 0) {
        this.auth.getDataList('companies').subscribe({
          next: (data: any) => {
            console.log(data);
            this.companies = data;
          },
          error(err) {
            console.error(err);
          },
        });
      } else {
        this.sharedService.dropdownValues$.subscribe(values => {
          this.city = values[0];
          this.companyName = values[2];
          console.log(values);
          console.log( this.city);
          console.log(this.companyName);


        });


        const inputCategory = this.city;
        const inputCategory2 = this.companyName;

        const filterValue1: any[] = [];

        if (this.city && this.companyName) {
          filterValue1.push({
            clause: '$and',
            conditions: [
                { column: 'districtname', operator: '$eq', value: inputCategory },
                { column: 'CompanyName', operator: '$eq', type: 'search', value: inputCategory2, FullTextSearch: true },
            ],
        });

        } else {
          filterValue1.push({
            clause: '$or',
            conditions: [
              { column: 'districtname', operator: '$eq', value: inputCategory },
              { column: 'CompanyName', operator: '$eq', value: inputCategory2},
          ],
      });
        }



        this.auth.getDataByFilter('companies', filterValue1).subscribe((xyz: any) => {
          console.log(xyz);

          this.companies = xyz;
        });
      }
    });
  }
  zoro2 = new FormGroup({
    searchQuery : new FormControl("")

  })

  companies:any

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
  my(abc:any){
    let val =abc._id

    // this.router.navigateByUrl('dashboard/companies-info/'+val);
  }

}
