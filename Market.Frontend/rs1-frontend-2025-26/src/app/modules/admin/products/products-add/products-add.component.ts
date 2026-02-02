import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from '../../../../core/components/base-classes/base-form-component';
import {
  CreateProductCommand
} from '../../../../api-services/products/products-api.models';
import { ProductsApiService } from '../../../../api-services/products/products-api.service';
import { ProductFormService } from '../services/product-form.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { CategoriesApiService } from '../../../../api-services/category/category-api.service';
import { BrandsApiService } from '../../../../api-services/brand/brand-api.service';
import { StoresApiService } from '../../../../api-services/stores/stores-api.service';
import { BranchesApiService } from '../../../../api-services/branches/branches-api.service';
import { ListCategoriesQueryDto } from '../../../../api-services/category/category-api.model';
import { ListBrandsQueryDto } from '../../../../api-services/brand/brand-api.model';
import { ListStoresQueryDto } from '../../../../api-services/stores/stores-api.models';
import { ListBranchesQueryDto } from '../../../../api-services/branches/branches-api.models';
import { allItemsPaging } from '../../../../core/models/paging/paging-utils';

@Component({
  selector: 'app-products-add',
  standalone: false,
  templateUrl: './products-add.component.html',
  styleUrl: './products-add.component.scss',
  providers: [ProductFormService]
})
export class ProductsAddComponent
  extends BaseFormComponent<any>
  implements OnInit {

  private api = inject(ProductsApiService);
  private categoriesApi = inject(CategoriesApiService);
  private brandsApi = inject(BrandsApiService);
  private storesApi = inject(StoresApiService);
  private branchesApi = inject(BranchesApiService);
  private formService = inject(ProductFormService);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  categories: ListCategoriesQueryDto[] = [];
  brands: ListBrandsQueryDto[] = [];
  stores: ListStoresQueryDto[] = [];
  branches: ListBranchesQueryDto[] = [];
  filteredBranches: ListBranchesQueryDto[] = [];

  ngOnInit(): void {
    this.initForm(false);
    this.loadFilters();
    this.setupBranchFiltering();
  }

  protected loadData(): void {
    // add mode only
  }

  protected save(): void {
    if (this.form.invalid || this.isLoading) {
      return;
    }

    this.startLoading();

    const command: CreateProductCommand =
      this.form.getRawValue() as CreateProductCommand;

    this.api.create(command).subscribe({
      next: () => {
        this.stopLoading();
        this.toaster.success('Proizvod je uspješno dodan');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        this.stopLoading('Greška pri dodavanju proizvoda');
        console.error('Create product error:', err);
      }
    });
  }

  protected override initForm(isEdit: boolean): void {
    super.initForm(isEdit);
    this.form = this.formService.createProductForm();
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }

  getErrorMessage(controlName: string): string {
    return this.formService.getErrorMessage(this.form, controlName);
  }

  private loadFilters(): void {
    this.categoriesApi.list({ paging: allItemsPaging }).subscribe({
      next: (response) => {
        this.categories = response.items;
      },
      error: (err) => {
        this.toaster.error('Greška pri učitavanju kategorija');
        console.error('Load categories error:', err);
      }
    });

    this.brandsApi.list({ paging: allItemsPaging }).subscribe({
      next: (response) => {
        this.brands = response.items;
      },
      error: (err) => {
        this.toaster.error('Greška pri učitavanju brendova');
        console.error('Load brands error:', err);
      }
    });

    this.storesApi.list({ paging: allItemsPaging, onlyActive: true }).subscribe({
      next: (response) => {
        this.stores = response.items;
      },
      error: (err) => {
        this.toaster.error('Greška pri učitavanju prodavnica');
        console.error('Load stores error:', err);
      }
    });
  }

  private setupBranchFiltering(): void {
    this.form.get('storeEntityId')?.valueChanges.subscribe((storeId) => {
      this.loadBranches(storeId ?? null);
    });
  }

  private loadBranches(storeId: number | null): void {
    if (!storeId) {
      this.branches = [];
      this.filteredBranches = [];
      this.form.get('branchEntityId')?.setValue(null);
      return;
    }

    this.branchesApi
      .list({ paging: allItemsPaging, onlyActive: true, storeEntityId: storeId })
      .subscribe({
        next: (response) => {
          this.branches = response.items;
          this.filteredBranches = response.items;

          const selectedBranchId = this.form.get('branchEntityId')?.value;
          if (selectedBranchId) {
            const stillValid = this.filteredBranches.some(
              (branch) => branch.id === selectedBranchId
            );
            if (!stillValid) {
              this.form.get('branchEntityId')?.setValue(null);
            }
          }
        },
        error: (err) => {
          this.toaster.error('Greška pri učitavanju poslovnica');
          console.error('Load branches error:', err);
        }
      });

  }
}
