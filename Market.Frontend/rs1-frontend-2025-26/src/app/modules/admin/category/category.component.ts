// import { Component, inject, OnInit } from '@angular/core';
// import { CategoriesApiService } from '../../../api-services/category/category-api.service';
// import { ListCategoriesQueryDto } from '../../../api-services/category/category-api.model';
//
// @Component({
//   selector: 'app-category',
//   standalone: false,
//   templateUrl: './category.component.html',
//   styleUrl: './category.component.scss',
// })
// export class CategoryComponent implements OnInit {
//   private apiService = inject(CategoriesApiService);
//
//   public categories: ListCategoriesQueryDto[] = [];
//   public isLoading = false;
//   public errorMessage: string | null = null;
//
//   ngOnInit() {
//     this.loadCategories();
//   }
//
//   private loadCategories(): void {
//     this.isLoading = true;
//     this.errorMessage = null;
//
//     this.apiService.list().subscribe({
//       next: (res) => {
//         this.categories = res.items ?? [];
//         this.isLoading = false;
//       },
//       error: (err) => {
//         this.isLoading = false;
//         this.errorMessage = 'Failed to load categories';
//         console.error('Load categories error:', err);
//       },
//     });
//   }
// }


import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CategoriesApiService } from '../../../api-services/category/category-api.service';
import { ListCategoriesQueryDto } from '../../../api-services/category/category-api.model';

import { DialogHelperService } from '../../shared/services/dialog-helper.service';
import { DialogButton } from '../../shared/models/dialog-config.model';
import { PageRequest } from '../../../core/models/paging/page-request';

// Lokalni tip (da ne puca import dok ne središ model)
type UpsertCategoryCommand = {
  name: string;
  description?: string;
};

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  private apiService = inject(CategoriesApiService);
  private dialogHelper = inject(DialogHelperService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  public categories: ListCategoriesQueryDto[] = [];
  public isLoading = false;
  public errorMessage: string | null = null;
  public isSaving = false;

  public searchControl = new FormControl<string>('');
  public form = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
  });

  public editingCategory: ListCategoriesQueryDto | null = null;

  ngOnInit(): void {
    this.loadCategories();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.loadCategories());
  }

  private loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.apiService
      .list({
        search: this.searchControl.value || undefined,
        paging: new PageRequest(),
      })
      .subscribe({
        next: (res) => {
          this.categories = res.items ?? [];
          this.isLoading = false;
        },
        error: (err: unknown) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to load categories';
          console.error('Load categories error:', err);
        },
      });
  }

  startCreate(): void {
    this.editingCategory = null;
    this.form.reset();
  }

  editCategory(category: ListCategoriesQueryDto): void {
    this.editingCategory = category;
    this.form.patchValue({
      name: category.name ?? '',
      description: category.description ?? '',
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  submit(): void {
    if (this.form.invalid || this.isSaving) return;

    const payload: UpsertCategoryCommand = {
      name: (this.form.value.name ?? '').trim(),
      description: this.form.value.description?.trim() || undefined,
    };

    if (!payload.name) return;

    this.isSaving = true;

    // UPDATE
    if (this.editingCategory) {
      this.apiService.update(this.editingCategory.id, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.dialogHelper.productCategory.showUpdateSuccess().subscribe();
          this.startCreate();
          this.loadCategories();
        },
        error: (err: unknown) => {
          this.isSaving = false;
          this.dialogHelper.productCategory.showUpdateError().subscribe();
          console.error('Save category error:', err);
        },
      });
      return;
    }

    // CREATE
    this.apiService.create(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.dialogHelper.productCategory.showCreateSuccess().subscribe();
        this.startCreate();
        this.loadCategories();
      },
      error: (err: unknown) => {
        this.isSaving = false;
        this.dialogHelper.productCategory.showCreateError().subscribe();
        console.error('Save category error:', err);
      },
    });
  }

  deleteCategory(category: ListCategoriesQueryDto): void {
    this.dialogHelper.productCategory
      .confirmDelete(category.name)
      .subscribe((result) => {
        if (result?.button !== DialogButton.DELETE) return;

        this.apiService.delete(category.id).subscribe({
          next: () => {
            this.dialogHelper.productCategory.showDeleteSuccess().subscribe();
            this.loadCategories();
          },
          error: (err: unknown) => {
            this.dialogHelper.productCategory.showDeleteError().subscribe();
            console.error('Delete category error:', err);
          },
        });
      });
  }
}
