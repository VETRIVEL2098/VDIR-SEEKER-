import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderEventComponent } from './header-event/header-event.component';
import { FooterEventComponent } from './footer-event/footer-event.component';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ScreenComponent } from './screen/screen.component';
import { DefaultComponent } from './default/default.component';



@NgModule({
  declarations: [
    HeaderEventComponent,
    FooterEventComponent,
    ScreenComponent,
    DefaultComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  exports:[
    HeaderEventComponent,
    FooterEventComponent,
    ScreenComponent,
    DefaultComponent
  ]
})
export class LayoutsModule { }
