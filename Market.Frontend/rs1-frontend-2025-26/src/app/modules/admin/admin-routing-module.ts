import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import {AdminSettingsComponent} from './admin-settings/admin-settings.component';
import {CategoryComponent} from './category/category.component';
import { BrandComponent } from './brand/brand.component';
import {CitiesComponent} from './cities/cities.component';
import {CitiesAddComponent} from './cities/cities-add/cities-add.component';
import {CitiesEditComponent} from './cities/cities-edit/cities-edit.component';
import {StoresComponent} from './stores/stores.component';
import {StoresAddComponent} from './stores/stores-add/stores-add.component';
import {StoresEditComponent} from './stores/stores-edit/stores-edit.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [

      {
        path: 'settings',
        component: AdminSettingsComponent,
      },
      {
        path: 'categories',
        component: CategoryComponent,
      },
      {
        path: 'brands',
        component: BrandComponent
      },
      {
        path: 'cities',
        component: CitiesComponent,
      },
      {
        path: 'cities/add',
        component: CitiesAddComponent,
      },
      {
        path: 'cities/:id/edit',
        component: CitiesEditComponent,
      },
      {
        path: 'stores',
        component: StoresComponent,
      },
      {
        path: 'stores/add',
        component: StoresAddComponent,
      },
      {
        path: 'stores/:id/edit',
        component: StoresEditComponent,
      },
      // default admin route → /admin/products
      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
