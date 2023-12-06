import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EventComponent } from './admin/event/event.component';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ComponentModule } from './component/component.module';
import { TokenInterceptor } from 'src/interceptor/tokenInceptor';


@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,AgGridModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    AgGridModule,
    MatIconModule,
    MatTabsModule,
    ComponentModule,
  
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
