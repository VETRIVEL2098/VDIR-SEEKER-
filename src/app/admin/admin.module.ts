import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ActionButtonComponent1 } from './jobs/action-button1';
import { JobsComponent } from './jobs/jobs.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CandidatesComponent } from './candidates/candidates.component';
import { ActionButtonComponent } from './candidates/action-button';
import { MatIconModule } from '@angular/material/icon';
import { PostedjobsComponent } from './postedjobs/postedjobs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { MatSliderModule } from '@angular/material/slider';
import { LayoutModule } from '../shared/layout/layout.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventComponent } from './event/event.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionButtonComponent2 } from './event/action-button2';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ActionButtonComponent1,
    ActionButtonComponent,
    ActionButtonComponent2,
    JobsComponent,
    CandidatesComponent,
    PostedjobsComponent,
    UserprofileComponent,
    EventComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    AngularEditorModule,
    MatIconModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatStepperModule,
    MatCardModule,
    FormsModule,
    LayoutModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatFormFieldModule,
    LayoutModule,
    NgbModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressBarModule,
    AdminRoutingModule,
    AgGridModule,
    ReactiveFormsModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class AdminModule {}
