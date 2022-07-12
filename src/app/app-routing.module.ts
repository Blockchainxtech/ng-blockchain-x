import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgBlockchainXComponent } from 'ng-blockchainx';

const routes: Routes = [
  { path: 'test', component: NgBlockchainXComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
