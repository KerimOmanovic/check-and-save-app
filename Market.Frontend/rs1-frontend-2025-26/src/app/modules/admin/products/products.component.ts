import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BaseListPagedComponent } from '../../../core/components/base-classes/base-list-paged-component';
import {
  ListProductsQuery,
  ListProductsQueryDto
} from '../../../api-services/products/products-api.models';
import { ProductsApiService } from '../../../api-services/products/products-api.service';
import {
  ListCategoriesQueryDto
} from '../../../api-services/category/category-api.model';
import { CategoriesApiService } from '../../../api-services/category/category-api.service';
import { BrandsApiService } from '../../../api-services/brand/brand-api.service';
import { ListBrandsQueryDto } from '../../../api-services/brand/brand-api.model';
import { ToasterService } from '../../../core/services/toaster.service';
import { allItemsPaging } from '../../../core/models/paging/paging-utils';
import { StoresApiService } from '../../../api-services/stores/stores-api.service';
import { ListStoresQueryDto } from '../../../api-services/stores/stores-api.models';
import { DialogHelperService } from '../../shared/services/dialog-helper.service';
import { DialogButton } from '../../shared/models/dialog-config.model';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent
  extends BaseListPagedComponent<ListProductsQueryDto, ListProductsQuery>
  implements OnInit {

  private productsApi = inject(ProductsApiService);
  private categoriesApi = inject(CategoriesApiService);
  private brandsApi = inject(BrandsApiService);
  private storesApi = inject(StoresApiService);
  private toaster = inject(ToasterService);
  private router = inject(Router);
  private dialogHelper = inject(DialogHelperService);

  displayedColumns: string[] = [
    'name',
    'category',
    'brand',
    'store',
    'dateAdded',
    'actions'
  ];

  categories: ListCategoriesQueryDto[] = [];
  brands: ListBrandsQueryDto[] = [];
  stores: ListStoresQueryDto[] = [];

  private categoryById = new Map<number, string>();
  private brandById = new Map<number, string>();
  private storeById = new Map<number, string>();

  constructor() {
    super();
    this.request = new ListProductsQuery();
    this.request.paging.pageSize = 10;
  }

  ngOnInit(): void {
    this.loadFilters();
    this.initList();
  }

  protected loadPagedData(): void {
    this.startLoading();

    this.productsApi.list(this.request).subscribe({
      next: (response) => {
        this.handlePageResult(response);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Greška pri učitavanju proizvoda');
        console.error('Load products error:', err);
      }
    });
  }

  onSearch(): void {
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  onCreate(): void {
    this.router.navigate(['/admin/products/add']);
  }

  onEdit(product: ListProductsQueryDto): void {
    this.router.navigate(['/admin/products', product.id, 'edit']);
  }

  onDelete(product: ListProductsQueryDto): void {
    this.dialogHelper.product.confirmDelete(product.name).subscribe((result) => {
      if (result && result.button === DialogButton.DELETE) {
        this.performDelete(product);
      }
    });
  }

  clearSearch(): void {
    this.request.search = '';
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  onFilterChange(): void {
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  resetFilters(): void {
    this.request.search = '';
    this.request.categoryEntityId = null;
    this.request.brandEntityId = null;
    this.request.storeEntityId = null;
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  private performDelete(product: ListProductsQueryDto): void {
    this.startLoading();

    this.productsApi.delete(product.id).subscribe({
      next: () => {
        this.toaster.success('Proizvod je uspješno obrisan');
        this.loadPagedData();
      },
      error: (err) => {
        this.stopLoading();
        this.dialogHelper.product.showDeleteError().subscribe();
        console.error('Delete product error:', err);
      }
    });
  }

  getCategoryName(categoryId: number): string {
    return this.categoryById.get(categoryId) ?? `#${categoryId}`;
  }

  getBrandName(brandId: number): string {
    return this.brandById.get(brandId) ?? `#${brandId}`;
  }

  getStoreName(storeId: number): string {
    return this.storeById.get(storeId) ?? `#${storeId}`;
  }

  private loadFilters(): void {
    this.categoriesApi.list({ paging: allItemsPaging }).subscribe({
      next: (response) => {
        this.categories = response.items;
        this.categoryById = new Map(
          response.items.map((category) => [category.id, category.name])
        );
      },
      error: (err) => {
        this.toaster.error('Greška pri učitavanju kategorija');
        console.error('Load categories error:', err);
      }
    });

    this.brandsApi.list({ paging: allItemsPaging }).subscribe({
      next: (response) => {
        this.brands = response.items;
        this.brandById = new Map(
          response.items.map((brand) => [brand.id, brand.name])
        );
      },
      error: (err) => {
        this.toaster.error('Greška pri učitavanju brendova');
        console.error('Load brands error:', err);
      }
    });

    this.storesApi.list({ paging: allItemsPaging }).subscribe({
      next: (response) => {
        this.stores = response.items;
        this.storeById = new Map(
          response.items.map((store) => [store.id, store.name])
        );
      },
      error: (err) => {
        this.toaster.error('Greška pri učitavanju prodavnica');
        console.error('Load stores error:', err);
      }
    });
  }
}
