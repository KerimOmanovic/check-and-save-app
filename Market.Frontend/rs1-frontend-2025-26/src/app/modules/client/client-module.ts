import { NgModule } from '@angular/core';
import { ClientRoutingModule } from './client-routing-module';
import { SharedModule } from '../shared/shared-module';
import { HomeComponent } from './client-pages/home/home.component';

@NgModule({
  imports: [
    SharedModule,
    ClientRoutingModule,
    HomeComponent
  ]
})
export class ClientModule { }
