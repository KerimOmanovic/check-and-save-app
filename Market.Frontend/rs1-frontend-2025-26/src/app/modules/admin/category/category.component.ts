import { Component, inject, OnInit } from '@angular/core';
import { CategoriesApiService } from '../../../api-services/category/category-api.service';
import { ListCategoriesQueryDto } from '../../../api-services/category/category-api.model';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit {
  private apiService = inject(CategoriesApiService);

  public categories: ListCategoriesQueryDto[] = [];
  public isLoading = false;
  public errorMessage: string | null = null;

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.apiService.list().subscribe({
      next: (res) => {
        this.categories = res.items ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load categories';
        console.error('Load categories error:', err);
      },
    });
  }
}

