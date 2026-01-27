import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';


export interface Brand {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class BrandFormService {
  // Use the same API base as your other services (Category: /Category)
  private readonly baseUrl = `${environment.apiUrl}/Brand`;
  private http = inject(HttpClient);

  // GET /Brand
  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.baseUrl);
  }

  // GET /Brand/{id}
  getBrandById(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.baseUrl}/${id}`);
  }

  // POST /Brand
  // If your backend returns created ID -> keep Observable<number>
  createBrand(brand: Partial<Brand>): Observable<number> {
    return this.http.post<number>(this.baseUrl, brand);
  }

  // PUT /Brand/{id}
  updateBrand(id: number, brand: Partial<Brand>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, brand);
  }

  // DELETE /Brand/{id}
  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
