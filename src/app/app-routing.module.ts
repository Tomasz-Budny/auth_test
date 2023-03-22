import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { DataPageComponent } from './data-page/data-page.component';

const routes: Routes = [
  {path: '', component: DataPageComponent},
  {path: 'auth', component: AuthPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
