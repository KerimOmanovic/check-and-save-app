import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { buildHttpParams } from '../../core/models/build-http-params';
import { ListBranchesQuery, ListBranchesResponse } from './branches-api.models';

@Injectable({ providedIn: 'root' })
export class BranchesApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Branches`;

  /** GET /Branches?paging.page=1&paging.pageSize=20&search=... */
  list(query: ListBranchesQuery): Observable<ListBranchesResponse> {
    const params = buildHttpParams(query);
    return this.http.get<ListBranchesResponse>(this.baseUrl, { params });
  }
}
