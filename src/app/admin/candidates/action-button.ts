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
  
}



</style>
 <div class="container">
  <!-- <button  class="btn btn-dark"   >Canditates Info</button> -->
  <mat-icon (click)="start($event);">group</mat-icon>
 </div>
  
    `
})

export class ActionButtonComponent implements ICellRendererAngularComp {
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
    this.params.context.componentParent.start(this.params.data,event)
  }
}
