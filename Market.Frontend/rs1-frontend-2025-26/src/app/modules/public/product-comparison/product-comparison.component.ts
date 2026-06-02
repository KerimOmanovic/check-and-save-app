import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ProductsApiService } from '../../../api-services/products/products-api.service';
import { GetProductByIdQueryDto } from '../../../api-services/products/products-api.models';
import { PricesApiService } from '../../../api-services/prices/prices-api.services';
import { ListPricesQueryDto } from '../../../api-services/prices/prices-api.models';
import { StoresApiService } from '../../../api-services/stores/stores-api.service';
import { ComparisonService } from '../services/comparison.service';
import { allItemsPaging } from '../../../core/models/paging/paging-utils';

interface ComparisonRow {
  productId: number;
  productName: string;
  imageUrl: string;
  storeId: number;
  storeName: string;
  price: number | null;
  dateUpdated: string | null;
}

@Component({
  selector: 'app-product-comparison',
  standalone: false,
  templateUrl: './product-comparison.component.html',
  styleUrl: './product-comparison.component.scss',
})
export class ProductComparisonComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly comparisonService = inject(ComparisonService);
  private readonly productsApi = inject(ProductsApiService);
  private readonly pricesApi = inject(PricesApiService);
  private readonly storesApi = inject(StoresApiService);

  protected selectedProductIds: number[] = [];
  protected rows: ComparisonRow[] = [];
  protected isLoading = false;
  protected errorMessage: string | null = null;

  ngOnInit(): void {
    this.selectedProductIds = this.resolveSelectedProductIds();

    if (this.selectedProductIds.length === 0) {
      this.errorMessage = 'Odaberite najmanje jedan proizvod za poređenje.';
      return;
    }

    this.loadComparisonRows();
  }

  protected get cheapestRow(): ComparisonRow | null {
    return this.rows
      .filter((row) => row.price !== null)
      .reduce<ComparisonRow | null>((cheapest, row) => {
        if (!cheapest || (row.price ?? Number.MAX_SAFE_INTEGER) < (cheapest.price ?? Number.MAX_SAFE_INTEGER)) {
          return row;
        }

        return cheapest;
      }, null);
  }

  protected clearComparison(): void {
    this.comparisonService.clear();
    this.router.navigate(['/']);
  }

  private resolveSelectedProductIds(): number[] {
    const serviceIds = this.comparisonService.selectedProductIds;
    if (serviceIds.length > 0) {
      return serviceIds;
    }


    const leftId = Number(this.route.snapshot.paramMap.get('leftId'));
    const rightId = Number(this.route.snapshot.paramMap.get('rightId'));
    const routeIds = [leftId, rightId].filter((id) => Number.isFinite(id) && id > 0);

    if (routeIds.length > 0) {
      this.comparisonService.setSelectedProductIds(routeIds);
    }

    return routeIds;
  }

  private loadComparisonRows(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const productRequests = this.selectedProductIds.map((productId) =>
      forkJoin({
        product: this.productsApi.getById(productId),
        prices: this.pricesApi
          .list({ productEntityId: productId, paging: allItemsPaging })
          .pipe(map((response) => response.items))
      })
    );

    forkJoin(productRequests).subscribe({
      next: (productResults) => {
        const storeIds = Array.from(
          new Set(productResults.map(({ product }) => product.storeEntityId))
        );

        const storeRequests = storeIds.map((storeId) =>
          this.storesApi.getById(storeId).pipe(
            map((store) => [storeId, store.name] as const),
            catchError(() => of([storeId, `Prodavnica #${storeId}`] as const))
          )
        );

        forkJoin(storeRequests).subscribe({
          next: (stores) => {
            const storeNameById = new Map(stores);
            this.rows = productResults
              .map(({ product, prices }) => this.mapComparisonRow(product, prices, storeNameById))
              .sort((left, right) => (left.price ?? Number.MAX_SAFE_INTEGER) - (right.price ?? Number.MAX_SAFE_INTEGER));
            this.isLoading = false;
          },
          error: () => {
            this.errorMessage = 'Prodavnice nisu dostupne za poređenje.';
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'Nije moguće učitati odabrane proizvode za poređenje.';
        this.rows = [];
        this.isLoading = false;
      }
    });
  }

  private mapComparisonRow(
    product: GetProductByIdQueryDto,
    prices: ListPricesQueryDto[],
    storeNameById: Map<number, string>
  ): ComparisonRow {
    const latestPrice = [...prices].sort(
      (left, right) => new Date(right.dateUpdated).getTime() - new Date(left.dateUpdated).getTime()
    )[0];

    return {
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageURL || 'assets/cart-icon.png',
      storeId: product.storeEntityId,
      storeName: storeNameById.get(product.storeEntityId) ?? `Prodavnica #${product.storeEntityId}`,
      price: latestPrice?.amount ?? null,
      dateUpdated: latestPrice?.dateUpdated ?? null
    };
  }
}
