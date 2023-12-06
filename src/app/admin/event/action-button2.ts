import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-button-renderer',
  template: `
<style>
::ng-deep.mat-mdc-dialog-container .mdc-dialog__surface {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden !important;
}
.button-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between; 
  align-items: center;
  
}



</style>
 <div  style="
  display: flex;
  flex-direction: row;
  margin-left:10px;margin-top:10px;
  align-items: center;">
 <!-- <button  class="btn btn-dark" style="margin-right:5px ;">View</button> -->
 <mat-icon  (click)="view($event)">visibility</mat-icon>
 <mat-icon style="margin-left: 10px;" (click)="start($event);">view_list</mat-icon>
 <mat-icon style="margin-left: 10px; cursor: pointer;" (click)="deleteRow($event)">delete</mat-icon>
  <!-- <button  class="btn btn-dark"   >Canditates</button> -->
 </div>
  
    `
})

export class ActionButtonComponent2 implements ICellRendererAngularComp {
  params: any
 
 public actions: any
  constructor(
    private router: Router,
    private httpclient: HttpClient,
  ) {


  }
  agInit(params: any): void {    
    this.params = params;
    this.actions = this.params['colDef']
}

  refresh(params?: any): boolean {
    return true;
  }
  start(event:any){
    console.log(this.params.data);
    
    this.params.context.componentParent.start(this.params.data,event)
  }
  view(event:any){
    // this.params.context.componentParent.view(this.params.data,event)

    this.router.navigate(["dashboard/event-list/",this.params.data._id])
  }
  deleteRow(event:any) {
    this.params.context.componentParent.deleteRow(this.params.data);
  }

}
