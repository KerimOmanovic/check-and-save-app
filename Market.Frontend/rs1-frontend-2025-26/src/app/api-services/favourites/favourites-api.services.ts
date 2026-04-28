import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ProductsApiService } from '../products/products-api.service';
import {
  FavouriteProductCardDto,
  FavoritesListResponse,
  FavoriteListItemDto
} from './favourites-api.models';


@Injectable({ providedIn: 'root' })
export class FavouritesApiService {
  private http = inject(HttpClient);
  private productsApi = inject(ProductsApiService);
  private baseUrl = `${environment.apiUrl}/Favorites`;

  getAll(): Observable<FavouriteProductCardDto[]> {
    const params = new HttpParams()
      .set('paging.page', '1')
      .set('paging.pageSize', '200');

    return this.http.get<FavoritesListResponse>(this.baseUrl, { params }).pipe(
      map((res) => res.items ?? []),
      switchMap((items) => this.buildCards(items))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);  }

  private buildCards(items: FavoriteListItemDto[]): Observable<FavouriteProductCardDto[]> {
    if (!items.length) {
      return of([]);
    }

    return forkJoin(
      items.map((item) =>
        this.productsApi.getById(item.productEntityId).pipe(
          map((product) => ({
            id: item.id,
            publicId: item.id.toString(),
            productEntityId: item.productEntityId,
            name: product.name,
            price: null,
            imageUrl: product.imageURL || null,
          }))
        )
      )
    );
  }
}
