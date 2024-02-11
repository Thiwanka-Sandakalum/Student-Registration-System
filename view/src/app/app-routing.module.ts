import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: UserManagementComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
