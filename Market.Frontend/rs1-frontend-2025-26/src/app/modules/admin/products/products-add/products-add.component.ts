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
    // add mode only - no data to load
  }

  protected save(): void {
    // Provjeri validnost forme
    if (this.form.invalid) {
      // Markiraj sva polja kao touched da se prikažu validacione greške
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      this.toaster.warning('Molimo popunite sva obavezna polja');
      console.warn('Form is invalid:', this.getFormValidationErrors());
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.startLoading();

    const formValue = this.form.getRawValue();

    // Konvertuj datum u ISO string format ako je Date objekat
    const command: CreateProductCommand = {
      ...formValue,
      dateAdded: formValue.dateAdded instanceof Date
        ? formValue.dateAdded.toISOString()
        : formValue.dateAdded
    };

    console.log('📤 Sending product create command:', command);

    this.api.create(command).subscribe({
      next: (response) => {
        console.log('✅ Product created successfully:', response);
        this.stopLoading();
        this.toaster.success('Proizvod je uspješno dodan');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('❌ Create product failed:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.error?.message || err.message,
          errors: err.error?.errors,
          fullError: err
        });

        this.stopLoading();

        // Prikaži detaljnu poruku greške
        let errorMsg = 'Greška pri dodavanju proizvoda';

        if (err.status === 400 && err.error?.errors) {
          // Validation errors iz backend-a
          const validationErrors = Object.entries(err.error.errors)
            .map(([field, messages]: [string, any]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          errorMsg = validationErrors || errorMsg;
        } else if (err.error?.message) {
          errorMsg = err.error.message;
        } else if (err.error?.title) {
          errorMsg = err.error.title;
        } else if (err.status === 0) {
          errorMsg = 'Greška u konekciji sa serverom. Provjerite internet vezu.';
        } else if (err.status === 401) {
          errorMsg = 'Nemate autorizaciju za ovu akciju';
        } else if (err.status === 403) {
          errorMsg = 'Pristup odbijen';
        } else if (err.status === 404) {
          errorMsg = 'API endpoint nije pronađen';
        } else if (err.status >= 500) {
          errorMsg = 'Greška na serveru. Pokušajte ponovo kasnije.';
        }

        this.errorMessage = errorMsg;
        this.toaster.error(errorMsg);
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
    // Učitaj kategorije
    this.categoriesApi.list({ paging: allItemsPaging }).subscribe({
      next: (response) => {
        this.categories = response.items;
        console.log('✅ Categories loaded:', this.categories.length);
      },
      error: (err) => {
        this.toaster.error('Greška pri učitavanju kategorija');
        console.error('Load categories error:', err);
      }
    });

    // Učitaj brendove
    this.brandsApi.list({ paging: allItemsPaging }).subscribe({
      next: (response) => {
        this.brands = response.items;
        console.log('✅ Brands loaded:', this.brands.length);
      },
      error: (err) => {
        this.toaster.error('Greška pri učitavanju brendova');
        console.error('Load brands error:', err);
      }
    });

    // Učitaj prodavnice (samo aktivne)
    this.storesApi.list({ paging: allItemsPaging, onlyActive: true }).subscribe({
      next: (response) => {
        this.stores = response.items;
        console.log('✅ Stores loaded:', this.stores.length);
      },
      error: (err) => {
        this.toaster.error('Greška pri učitavanju prodavnica');
        console.error('Load stores error:', err);
      }
    });
  }

  private setupBranchFiltering(): void {
    // Osluškuj promjene u polju prodavnice
    this.form.get('storeEntityId')?.valueChanges.subscribe((storeId) => {
      console.log('Store changed to:', storeId);
      this.loadBranches(storeId ?? null);
    });
  }

  private loadBranches(storeId: number | null): void {
    if (!storeId) {
      this.branches = [];
      this.filteredBranches = [];
      this.form.get('branchEntityId')?.setValue(null);
      console.log('No store selected, branches cleared');
      return;
    }

    console.log('Loading branches for store:', storeId);

    this.branchesApi
      .list({ paging: allItemsPaging, onlyActive: true, storeEntityId: storeId })
      .subscribe({
        next: (response) => {
          this.branches = response.items;
          this.filteredBranches = response.items;
          console.log('✅ Branches loaded:', this.filteredBranches.length);

          // Resetuj odabranu poslovnicu ako više nije validna
          const selectedBranchId = this.form.get('branchEntityId')?.value;
          if (selectedBranchId) {
            const stillValid = this.filteredBranches.some(
              (branch) => branch.id === selectedBranchId
            );
            if (!stillValid) {
              this.form.get('branchEntityId')?.setValue(null);
              console.log('Previous branch selection cleared');
            }
          }
        },
        error: (err) => {
          this.toaster.error('Greška pri učitavanju poslovnica');
          console.error('Load branches error:', err);
        }
      });
  }

  // Helper metoda za prikaz validation errors
  private getFormValidationErrors(): any {
    const errors: any = {};
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
