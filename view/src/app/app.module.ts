import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AddUserPopupComponent } from './components/add-user-popup/add-user-popup.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { LoginComponent } from './components/login/login.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditUserDialogComponent } from './components/edit-user-popup/edit-user-popup.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserManagementComponent,
    AddUserPopupComponent,
    EditUserDialogComponent,
    NavbarComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSortModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule

  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
