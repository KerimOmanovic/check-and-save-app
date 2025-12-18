import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ListCategoriesQueryDto,
  ListCategoriesQueryResponse,
  ListCategoriesQuery
} from './category-api.model';
import { buildHttpParams } from '../../core/models/build-http-params';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  private readonly baseUrl = `${environment.apiUrl}/ProductCategories`;
  private http = inject(HttpClient);

  /**
   * GET /ProductCategories
   * List categories with optional query parameters.
   */
  list(request?: ListCategoriesQuery): Observable<ListCategoriesQueryResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListCategoriesQueryResponse>(this.baseUrl, {
      params,
    });
  }

  /**
   * GET /ProductCategories/{id}
   * Get a single category by ID.
   */

  /**
   * POST /ProductCategories
   * Create a new category.
   * @returns ID of the newly created category
   */

  /**
   * PUT /ProductCategories/{id}
   * Update an existing category.
   */


  /**
   * DELETE /ProductCategories/{id}
   * Delete a category.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * PUT /ProductCategories/{id}/disable
   * Disable a category.
   */
  disable(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/disable`, {});
  }

  /**
   * PUT /ProductCategories/{id}/enable
   * Enable a category.
   */
  enable(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/enable`, {});
  }
}
