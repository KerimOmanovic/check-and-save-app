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
    const id = this.route.snapshot.params['id'];
    this.productId = Number(id);

    if (!this.productId || isNaN(this.productId)) {
      this.toaster.error('Nevažeći ID proizvoda');
      this.router.navigate(['/admin/products']);
      return;
    }

    console.log('Editing product with ID:', this.productId);
    this.initForm(true);
    this.loadFilters();
  }

  protected loadData(): void {
    this.startLoading();
    console.log('Loading product data for ID:', this.productId);

    this.api.getById(this.productId).subscribe({
      next: (product) => {
        console.log('✅ Product loaded:', product);
        this.model = product;
        this.dateAddedLabel = product.dateAdded;

        // Kreiraj formu sa učitanim podacima (bez dateAdded u edit modu)
        this.form = this.formService.createProductForm(product, false);

        // Postavi branch filtering nakon što je forma kreirana
        this.setupBranchFiltering();

        // Učitaj poslovnice za trenutno odabranu prodavnicu
        this.loadBranches(this.form.get('storeEntityId')?.value ?? null);

        this.stopLoading();
      },
      error: (err) => {
        console.error('❌ Load product failed:', err);
        this.stopLoading();

        let errorMsg = 'Greška pri učitavanju proizvoda';
        if (err.status === 404) {
          errorMsg = 'Proizvod nije pronađen';
        } else if (err.error?.message) {
          errorMsg = err.error.message;
        }

        this.toaster.error(errorMsg);
        this.router.navigate(['/admin/products']);
      }
    });
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

    const command: UpdateProductCommand = this.form.getRawValue() as UpdateProductCommand;

    console.log('📤 Sending product update command:', command);

    this.api.update(this.productId, command).subscribe({
      next: () => {
        console.log('✅ Product updated successfully');
        this.stopLoading();
        this.toaster.success('Proizvod je uspješno ažuriran');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('❌ Update product failed:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.error?.message || err.message,
          errors: err.error?.errors,
          fullError: err
        });

        this.stopLoading();

        // Prikaži detaljnu poruku greške
        let errorMsg = 'Greška pri ažuriranju proizvoda';

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
          errorMsg = 'Proizvod nije pronađen';
        } else if (err.status >= 500) {
          errorMsg = 'Greška na serveru. Pokušajte ponovo kasnije.';
        }

        this.errorMessage = errorMsg;
        this.toaster.error(errorMsg);
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

          // Provjeri da li je trenutno odabrana poslovnica još uvijek validna
          const selectedBranchId = this.form.get('branchEntityId')?.value;
          if (selectedBranchId) {
            const stillValid = this.filteredBranches.some(
              (branch) => branch.id === selectedBranchId
            );
            if (!stillValid) {
              this.form.get('branchEntityId')?.setValue(null);
              console.log('Previous branch selection cleared (not valid for new store)');
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
