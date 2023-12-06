import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { LayoutModule } from './layout/layout.module';
import { MatIconModule } from '@angular/material/icon';
import { LayoutsModule } from './layout-event/layouts.module';



@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    MatIconModule,
    LayoutsModule
  ]
})
export class SharedModule { }
