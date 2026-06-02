import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CreateProductCommand,
  GetProductByIdQueryDto,
  ListProductsQuery,
  ListProductsResponse,
  UpdateProductCommand
} from './products-api.models';

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Product`;

  /**
   * GET /Product
   * Lista proizvoda sa paging i filter parametrima
   */
  list(query: ListProductsQuery): Observable<ListProductsResponse> {
    // Kreiraj čiste parametre BEZ buildHttpParams funkcije
    let params = new HttpParams();

    // OBAVEZNI paging parametri
    const page = query.paging?.page ?? 1;
    const pageSize = query.paging?.pageSize ?? 10;

    params = params.set('paging.page', page.toString());
    params = params.set('paging.pageSize', pageSize.toString());

    // Opcionalni parametri - dodaj samo ako postoje vrijednosti
    if (query.search && query.search.trim() !== '') {
      params = params.set('search', query.search.trim());
    }

    if (query.categoryEntityId !== null && query.categoryEntityId !== undefined) {
      params = params.set('categoryEntityId', query.categoryEntityId.toString());
    }

    if (query.brandEntityId !== null && query.brandEntityId !== undefined) {
      params = params.set('brandEntityId', query.brandEntityId.toString());
    }

    if (query.storeEntityId !== null && query.storeEntityId !== undefined) {
      params = params.set('storeEntityId', query.storeEntityId.toString());
    }

    if (query.branchEntityId !== null && query.branchEntityId !== undefined) {
      params = params.set('branchEntityId', query.branchEntityId.toString());
    }

    const fullUrl = `${this.baseUrl}?${params.toString()}`;
    console.log('🌐 Products API - GET request:', {
      baseUrl: this.baseUrl,
      params: params.toString(),
      fullUrl: fullUrl
    });

    return this.http.get<ListProductsResponse>(this.baseUrl, { params });
  }

  /** GET /Product/{id} */
  getById(id: number): Observable<GetProductByIdQueryDto> {
    console.log('🌐 Products API - GET by ID:', id);
    return this.http.get<GetProductByIdQueryDto>(`${this.baseUrl}/${id}`);
  }

  /** POST /Product */
  create(command: CreateProductCommand): Observable<{ id: number }> {
    console.log('🌐 Products API - POST create:', command);
    return this.http.post<{ id: number }>(this.baseUrl, command);
  }

  /** PUT /Product/{id} */
  update(id: number, command: UpdateProductCommand): Observable<void> {
    console.log('🌐 Products API - PUT update:', { id, command });
    return this.http.put<void>(`${this.baseUrl}/${id}`, command);
  }

  /** DELETE /Product/{id} */
  delete(id: number): Observable<void> {
    console.log('🌐 Products API - DELETE:', id);
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
