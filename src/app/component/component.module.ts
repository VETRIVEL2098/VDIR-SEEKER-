import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DatatableComponent } from './datatable/datatable.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormlyMatCheckboxModule } from '@ngx-formly/material/checkbox';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { FormlyMatInputModule } from '@ngx-formly/material/input';
import { FormlyMatSelectModule } from '@ngx-formly/material/select';
import { FormlyMatRadioModule } from '@ngx-formly/material/radio';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { FormlyMatTextAreaModule } from '@ngx-formly/material/textarea';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { ActionButtonComponent } from './datatable/button';
import { FormlyMatToggleModule } from '@ngx-formly/material/toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MyLinkRendererComponent } from './datatable/cellstyle';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ControlModule } from '../control/control.module';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { AppRoutingModule } from '../app-routing.module';
import {MatStepperModule} from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DynamicFilterComponent } from './dynamic-filter/dynamic-filter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import {  DragDropModule } from '@angular/cdk/drag-drop';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

const appearance: any = {
  appearance: 'outline'
};



@NgModule({
  declarations: [
    DatatableComponent,

    DynamicFormComponent,
    DynamicFilterComponent,
    ActionButtonComponent,
    MyLinkRendererComponent,
  ],
  imports: [
    NgSelectModule,
    MatStepperModule,
    AppRoutingModule,
    CommonModule,
    DragDropModule,
    MatChipsModule,
    FormlyMatToggleModule,
    BrowserModule,
    AgGridModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    FormlyModule,
    ReactiveFormsModule,
    FormlyMatCheckboxModule,
    FormlyMatDatepickerModule,
    FormlyMatInputModule,
    MatButtonToggleModule,
    FormlyMatRadioModule,
    FormlyMatSelectModule,
    FlexLayoutModule,
    FormlyMaterialModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatListModule,
    MatSidenavModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSelectModule,
    FormlyMatFormFieldModule,
    FormlyMatTextAreaModule,
    MatNativeDateModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatTabsModule,
    MatDatepickerModule,
    ControlModule,
    MatGridListModule,
    MatExpansionModule,
    MatSlideToggleModule,
  ],


  exports: [
    DatatableComponent,
    DynamicFormComponent, 

    DynamicFilterComponent,
  ],

  providers: [
    DatePipe,
  ]
})
export class ComponentModule { }
