import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BrandsApiService } from '../../../api-services/brand/brand-api.service';
import { ListBrandsQueryDto, UpsertBrandCommand } from '../../../api-services/brand/brand-api.model';
import { DialogHelperService } from '../../shared/services/dialog-helper.service';
import { DialogButton } from '../../shared/models/dialog-config.model';
import { PageRequest } from '../../../core/models/paging/page-request';


@Component({
  selector: 'app-brand',
  standalone: false,
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss',
})
export class BrandComponent implements OnInit {
  private apiService = inject(BrandsApiService);
  private dialogHelper = inject(DialogHelperService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  public brands: ListBrandsQueryDto[] = [];
  public isLoading = false;
  public errorMessage: string | null = null;
  public isSaving = false;

  public searchControl = new FormControl('');
  public form = this.fb.group({
    name: ['', [Validators.required]],
    description: ['']
  });
  public editingBrand: ListBrandsQueryDto | null = null;

  ngOnInit(): void {
    this.loadBrands();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadBrands());
  }

  private loadBrands(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.apiService
      .list({
        search: this.searchControl.value ?? undefined,
        paging: new PageRequest()
      })
      .subscribe({
        next: (res) => {
          this.brands = res.items ?? [];
          this.isLoading = false;
        },
        error: (err: unknown) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to load brands';
          console.error('Load brands error:', err);
        }
      });
  }

  startCreate(): void {
    this.editingBrand = null;
    this.form.reset();
  }

  editBrand(brand: ListBrandsQueryDto): void {
    this.editingBrand = brand;
    this.form.patchValue({
      name: brand.name,
      description: brand.description
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  submit(): void {
    if (this.form.invalid || this.isSaving) {
      return;
    }

    const name = this.form.value.name?.trim();
    if (!name) {
      return;
    }

    const payload: UpsertBrandCommand = {
      name,
      description: this.form.value.description?.trim() || undefined
    };

    this.isSaving = true;

    if (this.editingBrand) {
      this.apiService.update(this.editingBrand.id, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.dialogHelper.brand.showUpdateSuccess().subscribe();
          this.startCreate();
          this.loadBrands();
        },
        error: (err: unknown) => {
          this.isSaving = false;
          this.dialogHelper.brand.showUpdateError().subscribe();
          console.error('Save brand error:', err);
        }
      });
      return;
    }

    this.apiService.create(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.dialogHelper.brand.showCreateSuccess().subscribe();
        this.startCreate();
        this.loadBrands();
      },
      error: (err: unknown) => {
        this.isSaving = false;
        this.dialogHelper.brand.showCreateError().subscribe();
        console.error('Save brand error:', err);
      }
    });
  }

  deleteBrand(brand: ListBrandsQueryDto): void {
    this.dialogHelper.brand.confirmDelete(brand.name).subscribe(result => {
      if (result?.button !== DialogButton.DELETE) {
        return;
      }

      this.apiService.delete(brand.id).subscribe({
        next: () => {
          this.dialogHelper.brand.showDeleteSuccess().subscribe();
          this.loadBrands();
        },
        error: (err: unknown) => {
          this.dialogHelper.brand.showDeleteError().subscribe();
          console.error('Delete brand error:', err);
        }
      });
    });
  }
}
