import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { DataPageComponent } from './data-page/data-page.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {path: '', component: DataPageComponent, canActivate: [AuthGuard]},
  {path: 'auth', component: AuthPageComponent},
  {path: '**', redirectTo: 'auth'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
