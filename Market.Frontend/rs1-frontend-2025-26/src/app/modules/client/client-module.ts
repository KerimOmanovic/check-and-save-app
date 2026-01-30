import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { ClientRoutingModule } from './client-routing-module';
import { HomeComponent } from './client-pages/home-page/home.component';

@NgModule({
  imports: [
    SharedModule,
    ClientRoutingModule,
    HomeComponent
  ]
})
export class ClientModule {}
