import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { FavouriteProductCardDto } from './favourites-api.models';

@Injectable({ providedIn: 'root' })
export class FavouritesApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/favourites`;

  getAll(): Observable<FavouriteProductCardDto[]> {
    return this.http.get<FavouriteProductCardDto[]>(this.baseUrl);
  }

  delete(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${publicId}`);
  }
}
