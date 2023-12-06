import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';




import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { AdminRoutingModule } from '../admin/admin-routing.module';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import {MatSliderModule} from '@angular/material/slider';

import { HomeComponent } from './home/home.component';

import { LayoutModule } from '../shared/layout/layout.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EventListComponent } from './event-list/event-list.component';
import { MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { AgendaAddComponent } from './agenda-add/agenda-add.component';
import {  MatDatepickerModule } from '@angular/material/datepicker';
// import { NgxMatDatetimePickerModule } from 'ngx-mat-datetime-picker';
import { MatNativeDateModule } from '@angular/material/core';
@NgModule({
  declarations: [



HomeComponent,
    AppliedJobsComponent,
    JobDetailsComponent,
    EventListComponent,
    AgendaAddComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    DashboardRoutingModule,MatSliderModule,MatIconModule,MatTabsModule,MatInputModule, MatProgressBarModule,
    MatButtonModule,MatSliderModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDatepickerModule,
    AdminRoutingModule, AgGridModule,ReactiveFormsModule,FormsModule,NgMultiSelectDropDownModule.forRoot(),
    CommonModule,AngularEditorModule, MatButtonModule,MatSliderModule,
    MatDialogModule,
    MatButtonModule,
    // NgxMatDatetimePickerModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatCardModule,
    FormsModule,LayoutModule,
    ReactiveFormsModule, MatRadioModule,
    MatFormFieldModule,LayoutModule,

    MatInputModule, MatProgressBarModule,
    AdminRoutingModule, AgGridModule,ReactiveFormsModule,FormsModule,NgMultiSelectDropDownModule.forRoot(),

  ]
})
export class DashboardModule { }

