import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { DashLayoutComponent } from './dash-layout/dash-layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSelectModule } from '@angular/material/select';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HeaderAdminComponent } from './header-admin/header-admin.component';
import { ImageComponent } from './image/image.component';
import { MapComponent } from './map/map.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';

import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from './card/card.component';
import { LocationComponent } from './location/location.component';


@NgModule({
  declarations: [
    AuthLayoutComponent,
    DashLayoutComponent,
    HeaderComponent,
    FooterComponent,
    AdminLayoutComponent,
    SidenavComponent,
    HeaderAdminComponent,
    ImageComponent,
    MapComponent,
    CardComponent,
    LocationComponent
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
    AuthLayoutComponent,
    DashLayoutComponent,
    HeaderComponent,
    FooterComponent,
    AdminLayoutComponent,
    SidenavComponent,ImageComponent, MapComponent,
    CardComponent,
    LocationComponent




  ]
})
export class LayoutModule { }
