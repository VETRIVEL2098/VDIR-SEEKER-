import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/search.service';
import { ColDef, FirstDataRenderedEvent, GridReadyEvent } from 'ag-grid-community';
import { IDropdownSettings, } from 'ng-multiselect-dropdown';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as moment from 'moment';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActionButtonComponent2 } from './action-button2';
import { v4 as uuidv4 } from 'uuid';



@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  Email: any

  companies: any;
  mode: any
  industry: any;
  description: any;
  company: any;
  location: any;
  salary: any;

  status1: any;
  contactName: any;
  email: any;
  phoneNumber: any;
  role: any;
  department: any;
  enddate: any;
  startdate: any;
  eventName: any;
  // url: any = null;
  url1: any = null;
  flag1: boolean = true;
  flag2: boolean = true;
  jobDescription: any
  requirements: any
  formattedDate: any
  keySkills: any
  companyId: any
  // Example initialization
  rowData: any[] = [];
  eventId: any
  validity: any
  address1: any
  id: any
  url: any = null;
  button: boolean = false;
  validityFlag: boolean = false;
  len: any
  contactDetails: any
  website: any
  frameworkComponents: any
  rating: number[] = [20, 80];
  eventbanner: any
  eventlogo: any
  value: any
  arr: any[] = [];
  sarlaryrange: any
  rolerange: any
  model!: NgbDateStruct;
  workmode: any
  fields: ColDef[] = [
    {
      "headerName": "Event Name",
      "field": "eventName",
      "filter": "agTextColumnFilter",
      "maxWidth": 350
    }, {
      "headerName": "Mode",
      "field": "mode",
      "filter": "agTextColumnFilter",
    },
    {
      "headerName": "Status",
      "field": "status1",
      "filter": "agTextColumnFilter",
      "maxWidth": 350
    },
    {
      "headerName": "Start Date",
      "field": "startdate",
      "filter": "agTextColumnFilter",
      "maxWidth": 350
    },
    {
      "headerName": "End Date",
      "field": "enddate",
      "filter": "agTextColumnFilter",
      "maxWidth": 350
    },
    {
      "headerName": "Action",
      "cellRenderer": "buttonRenderer"

    }

  ]
  context: any
  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'education',
    textField: 'education',
    itemsShowLimit: 3, limitSelection: 3,
    allowSearchFilter: true
  };
  formControl: any
  editorConfig: AngularEditorConfig = {
    editable: true,
    height: "130px",
    spellcheck: true,
    translate: 'yes',
    fonts: [
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' }
    ],
    toolbarHiddenButtons: [
      [
        'customClasses',
        'insertImage',
        'insertVideo',
        'removeFormat', 'underline', 'heading', 'insertHorizontalRule', 'link', 'insertOrderedList',
        'toggleEditorMode', 'bold', 'italic', 'strikeThrough', 'backgroundColor', 'textColor', 'textColor', 'unlink', 'fontSize'
      ]
    ]

  }
  showMapDiv = false;
  params: any;

  showMap() {
    this.showMapDiv = true;
  }

  hideMap() {
    this.showMapDiv = false;
  }
  mapdata: any

  click(event: any) {
    console.log(event);

    this.mapdata = {
      Latitude: event[0],
      Longitude: event[1]
    };
  }
  formgrp = this.fb.group({
    eventId: ['e' + uuidv4()],
    eventName: ['', Validators.required],
    mode: ['', [Validators.required]],
    startdate: ['', Validators.required],
    enddate: ['', Validators.required],
    time1: ['', Validators.required],
    duration: ['', Validators.required],
    Description: [''],
    isRegisterMandatory: [false],
    address1: [''],
    Location: [''],
    opening: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    status1: ['open'],
    contactName: [''],
    email: [''],
    phoneNumber: [''],
    role: [''],
    fullDescription: ['']

  })

  overlayNoRowsTemplate =
    '<span style="padding: 10px; background:white ;">No Data Found</span>"';
  flag: boolean = false;
  update_id: any
  constructor(private http: HttpClient, private calendar: NgbCalendar, private api: ApiService, private router: Router, private fb: FormBuilder,) {
    this.value = this.api.getdetails()
    console.log(this.value);
    this.companyId = this.value.unique_id
    console.log(this.companyId);
    this.context = { componentParent: this };
    this.frameworkComponents = {
      buttonRenderer: ActionButtonComponent2,
    };


    this.context = { componentParent: this };

    this.refrsh()
    this.api.GetALL('salary').subscribe((abc2: any) => {
      this.sarlaryrange = abc2
    })
    this.api.GetALL('education').subscribe((abc3: any) => {
      this.dropdownList = abc3


    })

    this.api.GetALL('role_category').subscribe((abc4: any) => {
      this.rolerange = abc4
      this.rolerange.sort((a: any, b: any) => a.category.localeCompare(b.category));



    })

  }


  view(data: any, event: any) {
    debugger
    this.flag = true
    this.button = true;
    let row = data

    this.update_id = data
    console.log(this.update_id['_id']);

    let valid: Date = row.validity;
    console.log(row);

    // let date:any=this.formatMonthInNumber(row.CreatedOn)
    this.formgrp.controls['mode'].setValue(row.mode);
    this.formgrp.controls['mode'].setValue(row.mode);
    this.formgrp.controls['Location'].setValue(row.Location);
    this.formgrp.controls['Description'].setValue(row.Description);
    this.formgrp.controls['address1'].setValue(row.address1);
    this.formgrp.controls['status1'].setValue(row.status1);
    this.formgrp.controls['startdate'].setValue(row.startdate);
    this.formgrp.controls['enddate'].setValue(row.enddate);
    this.formgrp.controls['time1'].setValue(row.time1);
    this.formgrp.controls['duration'].setValue(row.duration);
    this.formgrp.controls['eventName'].setValue(row.eventName);
    this.formgrp.controls['opening'].setValue(row.opening);
    this.formgrp.controls['fullDescription'].setValue(row.fullDescription);
    this.formgrp.controls['contactName'].setValue(row['primaryContact']['contactName']);
    this.formgrp.controls['email'].setValue(row['primaryContact']['email']);
    this.formgrp.controls['phoneNumber'].setValue(row['primaryContact']['phoneNumber']);
    this.formgrp.controls['role'].setValue(row['primaryContact']['role']);


    this.url = row['eventLogo']
    this.url1 = row['eventBanner']
    this.router.navigate(["dashboard/event-list/", this.params.data._id], {
      state: { data: this.update_id }
    });

    this.startval = row.MinimumExperience;


    this.endval = row.MaximumExperience;

  }
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }
  gridApi: any
  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
  }
  public defaultColDef: ColDef = {
    resizable: true,
    suppressMovable: true,


  };
  updatevalue() {
    debugger;

    let formValues: any = this.formgrp.getRawValue();
    console.log(formValues);

    let id = this.update_id._id;
    const eventId = this.update_id.eventId;
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
      this.refrsh();
      this.formgrp.reset();
    });
  }

  getAllJobslen() {

    return new Promise((resolve, reject) => {

      this.api.getDataList('event').subscribe((xyz: any) => {
        let value = xyz
        if (value != null) {
          let len: any = (Object.keys(value).length) - 1;
          var data: any = JSON.parse(value[len].eventName)
          if (data != undefined || data != null) {
            resolve(data)
          } else {
            resolve('1')
          }
        }
      });
    })
  }
  rowselection: boolean = false
  onSelect(row: any) {
    row = row.api.getSelectedRows()[0]
    console.log(row);
    console.log(row.workmode);

    this.formgrp.controls['mode'].setValue(row.mode);
    this.formgrp.controls['Location'].setValue(row.Location);
    this.formgrp.controls['Description'].setValue(row.Description);
    this.formgrp.controls['address1'].setValue(row.address1);
    this.formgrp.controls['eventName'].setValue(row.eventName);
    this.formgrp.controls['startdate'].setValue(row.startdate);
    this.formgrp.controls['enddate'].setValue(row.enddate);
    this.formgrp.controls['time1'].setValue(row.time1);
    this.formgrp.controls['duration'].setValue(row.duration);
    this.formgrp.controls['opening'].setValue(row.opening);
    this.formgrp.controls['fullDescription'].setValue(row.fullDescription);
    this.formgrp.controls['status1'].setValue(row.status1);
    this.formgrp.controls['contactName'].setValue(row['primaryContact']['contactName']);
    this.formgrp.controls['email'].setValue(row['primaryContact']['email']);
    this.formgrp.controls['phoneNumber'].setValue(row['primaryContact']['phoneNumber']);
    this.formgrp.controls['role'].setValue(row['primaryContact']['role']);
    this.url = row['eventLogo']
    this.url1 = row['eventBannner']

  }
  start(data: any, event: any) {
    debugger
    let id = data._id
    this.router.navigate(["event-details/" + id])
  }

  formatMonthInNumber(dateString: any) {

    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // Adding 1 since getMonth() returns 0 for January
    const date = dateObj.getDate();
    let final = date + "-" + month + "-" + year
    return final
  }
  emptyvalue() {
    this.formgrp.reset();
  }
  deleteRow(data: any) {
    if (!data || !data['_id']) {
      console.warn('Invalid or missing update_id');
      return;
    }

    let deleteid = data['_id'];
    console.log(data['_id'], deleteid);

    this.api.deleteData('event', deleteid).subscribe(
      (response) => {
        console.log('Data deleted successfully', response);
        // If you want to update the local array after successful deletion, you can call deleteRow
        // this.deleteRow({ id: id });
        this.removeRowFromGrid(data);

      },
      (error) => {
        console.error('Error deleting data', error);
        // Handle error if needed
      }
    );
  }
  removeRowFromGrid(deletedRow: any) {
    // Assuming this.companies is your grid data source
    this.companies = this.companies.filter((row: { _id: any; }) => row._id !== deletedRow._id);
    // Refresh the grid by updating the rowData property
    this.gridApi.setRowData(this.companies);
  }





  requirements1: any
  my() {
    this.router.navigate(['dashboard/event-list']);

  }
  startval: number = 0
  endval: number = 1
  logFormValues() {
    debugger
    // console.log('====================================');
    // console.log(this.formgrp.controls);

    // console.log('====================================');
    if (this.formgrp.valid) {
      // var job_id=JSON.stringify(this.jobId+1)
      let cn = this.value.CompanyName
      let address: any
      // console.log(this.value.is_branch_available);

      if (!this.value.is_branch_available) {
        address = (this.value.area + ' ' + this.value.districtname + ' ' + this.value.statename + ' ' + this.value.pincode)
        this.formgrp.controls['Location'].setValue(address);
      }


      this.formgrp.controls['status1'].setValue('open');
      let formValues: any = this.formgrp.getRawValue()
      formValues.primaryContact = {
        contactName: this.formgrp.get('contactName')?.value,
        email: this.formgrp.get('email')?.value,
        phoneNumber: this.formgrp.get('phoneNumber')?.value,
        role: this.formgrp.get('role')?.value,
      };
      // Remove individual properties from the main formValues object
      if (formValues.Location == '') {
        formValues.Location = this.value.area + this.value.districtname + this.value.statename + this.value.pincode
      }
      formValues.companyId = this.companyId;
      console.log(formValues.companyId);
      console.log(this.companyId);

      console.log(formValues);
      console.log(formValues);
      delete formValues.contactName;
      delete formValues.role;
      delete formValues.phone;
      delete formValues.email;





      this.api.save('event', formValues).subscribe((xyz: any) => {
        console.log(xyz);
        console.log("uploaded");

        this.refrsh()
        this.formgrp.reset()
      })

    }
  }

  refrsh() {
    debugger
    this.endval = 1
    this.startval = 0
    console.log(this.value);
    const filterValue1: any = [
      {
        clause: "$and",
        conditions: [
          { column: "companyId", operator: "$eq", value: this.value.unique_id },
        ]
      }
    ];
    this.api.getDataByFilter("event", filterValue1).subscribe((data: any) => {

      console.log(data);
      if (data != null) {
        console.log("data has been changed");
        this.companies = data.map((xyz: any) => ({
          ...xyz,
          validity: this.formatMonthInNumber(xyz.validity)
        }));
      }


    })

  }
  handleFileUpload(id: any, type?: any) {
    console.log(this.formgrp.value.eventId);
     if (!this.formgrp || !this.formgrp.value.eventId) {
      console.error("formValues or eventId is not available");
      return;
    }

    const fileInput: any = document.getElementById(id);
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('eventId', this.formgrp.value.eventId);
    formData.append('category', type);

    if (id == "eventLogo") {
      this.eventlogo = formData;
    } else {
      this.eventbanner = formData;
    }
  }

  onSelectFile(event: any, type?: any) {
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

}
