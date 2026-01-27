// import { Component, DestroyRef, inject, OnInit } from '@angular/core';
// import { FormBuilder, FormControl, Validators } from '@angular/forms';
// import { debounceTime, distinctUntilChanged } from 'rxjs';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { BrandsApiService } from '../../../api-services/brand/brand-api.service';
// import { ListBrandsQueryDto, UpsertBrandCommand } from '../../../api-services/brand/brand-api.model';
// import { DialogHelperService } from '../../shared/services/dialog-helper.service';
// import { DialogButton } from '../../shared/models/dialog-config.model';
// import { PageRequest } from '../../../core/models/paging/page-request';
//
//
// @Component({
//   selector: 'app-brand',
//   standalone: false,
//   templateUrl: './brand.component.html',
//   styleUrl: './brand.component.scss',
// })
// export class BrandComponent implements OnInit {
//   private apiService = inject(BrandsApiService);
//   private dialogHelper = inject(DialogHelperService);
//   private fb = inject(FormBuilder);
//   private destroyRef = inject(DestroyRef);
//
//   public brands: ListBrandsQueryDto[] = [];
//   public isLoading = false;
//   public errorMessage: string | null = null;
//   public isSaving = false;
//
//   public searchControl = new FormControl('');
//   public form = this.fb.group({
//     name: ['', [Validators.required]],
//     description: ['']
//   });
//   public editingBrand: ListBrandsQueryDto | null = null;
//
//   ngOnInit(): void {
//     this.loadBrands();
//
//     this.searchControl.valueChanges
//       .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
//       .subscribe(() => this.loadBrands());
//   }
//
//   private loadBrands(): void {
//     this.isLoading = true;
//     this.errorMessage = null;
//
//     this.apiService
//       .list({
//         search: this.searchControl.value ?? undefined,
//         paging: new PageRequest()
//       })
//       .subscribe({
//         next: (res) => {
//           this.brands = res.items ?? [];
//           this.isLoading = false;
//         },
//         error: (err: unknown) => {
//           this.isLoading = false;
//           this.errorMessage = 'Failed to load brands';
//           console.error('Load brands error:', err);
//         }
//       });
//   }
//
//   startCreate(): void {
//     this.editingBrand = null;
//     this.form.reset();
//   }
//
//   editBrand(brand: ListBrandsQueryDto): void {
//     this.editingBrand = brand;
//     this.form.patchValue({
//       name: brand.name,
//       description: brand.description
//     });
//   }
//
//   clearSearch(): void {
//     this.searchControl.setValue('');
//   }
//
//   submit(): void {
//     if (this.form.invalid || this.isSaving) {
//       return;
//     }
//
//     const name = this.form.value.name?.trim();
//     if (!name) {
//       return;
//     }
//
//     const payload: UpsertBrandCommand = {
//       name,
//       description: this.form.value.description?.trim() || undefined
//     };
//
//     this.isSaving = true;
//
//     if (this.editingBrand) {
//       this.apiService.update(this.editingBrand.id, payload).subscribe({
//         next: () => {
//           this.isSaving = false;
//           this.dialogHelper.brand.showUpdateSuccess().subscribe();
//           this.startCreate();
//           this.loadBrands();
//         },
//         error: (err: unknown) => {
//           this.isSaving = false;
//           this.dialogHelper.brand.showUpdateError().subscribe();
//           console.error('Save brand error:', err);
//         }
//       });
//       return;
//     }
//
//     this.apiService.create(payload).subscribe({
//       next: () => {
//         this.isSaving = false;
//         this.dialogHelper.brand.showCreateSuccess().subscribe();
//         this.startCreate();
//         this.loadBrands();
//       },
//       error: (err: unknown) => {
//         this.isSaving = false;
//         this.dialogHelper.brand.showCreateError().subscribe();
//         console.error('Save brand error:', err);
//       }
//     });
//   }
//
//   deleteBrand(brand: ListBrandsQueryDto): void {
//     this.dialogHelper.brand.confirmDelete(brand.name).subscribe(result => {
//       if (result?.button !== DialogButton.DELETE) {
//         return;
//       }
//
//       this.apiService.delete(brand.id).subscribe({
//         next: () => {
//           this.dialogHelper.brand.showDeleteSuccess().subscribe();
//           this.loadBrands();
//         },
//         error: (err: unknown) => {
//           this.dialogHelper.brand.showDeleteError().subscribe();
//           console.error('Delete brand error:', err);
//         }
//       });
//     });
//   }
// }
// brand.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { BrandFormService, Brand } from './services/brand-form.service';


@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
})
export class BrandComponent implements OnInit {
  // Reactive search input
  searchControl = new FormControl<string>('');

  // Data
  brands: Brand[] = [];
  filteredBrands: Brand[] = [];

  // UI state
  isLoading = false;
  errorMessage: string | null = null;

  // Dependencies
  private router = inject(Router);
  private brandService = inject(BrandFormService);

  ngOnInit(): void {
    this.loadBrands();

    // Filter list as user types
    this.searchControl.valueChanges.subscribe((value: string | null) => {
      this.filterBrands(value);
    });
  }

  // Load brands from API
  loadBrands(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.brandService.getBrands().subscribe({
      next: (data: Brand[]) => {
        this.brands = data ?? [];
        this.filteredBrands = this.brands;
        this.isLoading = false;
      },
      error: (error: unknown) => {
        this.isLoading = false;
        this.errorMessage = 'Greška pri učitavanju brendova';
        console.error('Load brands error:', error);
      },
    });
  }

  // Filter brands locally (client-side)
  filterBrands(searchTerm: string | null): void {
    const term = (searchTerm ?? '').trim().toLowerCase();

    if (!term) {
      this.filteredBrands = this.brands;
      return;
    }

    this.filteredBrands = this.brands.filter((brand) => {
      const name = (brand.name ?? '').toLowerCase();
      const desc = (brand.description ?? '').toLowerCase();
      return name.includes(term) || desc.includes(term);
    });
  }

  // Clear search input
  clearSearch(): void {
    this.searchControl.setValue('');
  }

  // Navigate to add brand page
  goToAddBrand(): void {
    this.router.navigate(['/brand/brand-add']);
  }

  // Navigate to edit brand page
  goToEditBrand(brandId: number): void {
    this.router.navigate(['/brand/brand-edit', brandId]);
  }

  // Delete brand via API
  deleteBrand(brand: Brand): void {
    const ok = confirm(`Da li ste sigurni da želite obrisati brend "${brand.name}"?`);
    if (!ok) return;

    this.brandService.deleteBrand(brand.id).subscribe({
      next: () => {
        this.loadBrands();
      },
      error: (error: unknown) => {
        alert('Greška pri brisanju brenda');
        console.error('Delete brand error:', error);
      },
    });
  }
}
