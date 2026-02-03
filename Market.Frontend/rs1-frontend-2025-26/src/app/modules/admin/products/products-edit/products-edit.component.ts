import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from '../../../../core/components/base-classes/base-form-component';
import {
  GetProductByIdQueryDto,
  UpdateProductCommand
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
  selector: 'app-products-edit',
  standalone: false,
  templateUrl: './products-edit.component.html',
  styleUrl: './products-edit.component.scss',
  providers: [ProductFormService]
})
export class ProductsEditComponent
  extends BaseFormComponent<GetProductByIdQueryDto>
  implements OnInit {

  private api = inject(ProductsApiService);
  private categoriesApi = inject(CategoriesApiService);
  private brandsApi = inject(BrandsApiService);
  private storesApi = inject(StoresApiService);
  private branchesApi = inject(BranchesApiService);
  private formService = inject(ProductFormService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  productId!: number;
  dateAddedLabel = '';

  categories: ListCategoriesQueryDto[] = [];
  brands: ListBrandsQueryDto[] = [];
  stores: ListStoresQueryDto[] = [];
  branches: ListBranchesQueryDto[] = [];
  filteredBranches: ListBranchesQueryDto[] = [];

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.params['id']);
    this.initForm(true);
    this.loadFilters();
  }

  protected loadData(): void {
    this.startLoading();

    this.api.getById(this.productId).subscribe({
      next: (product) => {
        this.model = product;
        this.dateAddedLabel = product.dateAdded;
        this.form = this.formService.createProductForm(product, false);
        this.setupBranchFiltering();
        this.loadBranches(this.form.get('storeEntityId')?.value ?? null);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Greška pri učitavanju proizvoda');
        this.toaster.error('Proizvod nije pronađen');
        console.error('Load product error:', err);
        this.router.navigate(['/admin/products']);
      }
    });
  }

  protected save(): void {
    if (this.form.invalid || this.isLoading) {
      return;
    }

    this.startLoading();

    const command: UpdateProductCommand =
      this.form.getRawValue() as UpdateProductCommand;

    this.api.update(this.productId, command).subscribe({
      next: () => {
        this.stopLoading();
        this.toaster.success('Proizvod je uspješno ažuriran');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        this.stopLoading('Greška pri ažuriranju proizvoda');
        console.error('Update product error:', err);
      }
    });
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
