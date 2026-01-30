import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { buildHttpParams } from '../../core/models/build-http-params';
import {
  GetProductByIdQueryDto,
  ListProductsQuery,
  ListProductsResponse
} from './products-api.models';

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Product`;

  /** GET /Product?paging.page=1&paging.pageSize=20&search=... */
  list(query: ListProductsQuery): Observable<ListProductsResponse> {
    const params = buildHttpParams(query);
    return this.http.get<ListProductsResponse>(this.baseUrl, { params });
  }

  /** GET /Product/{id} */
  getById(id: number): Observable<GetProductByIdQueryDto> {
    return this.http.get<GetProductByIdQueryDto>(`${this.baseUrl}/${id}`);
  }
}
