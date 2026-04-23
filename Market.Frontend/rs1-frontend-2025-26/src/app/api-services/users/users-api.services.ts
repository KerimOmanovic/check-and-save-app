import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmailAvailabilityDto, UpdateProfileCommand, UserProfileDto } from './users-api.model';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly baseUrl = `${environment.apiUrl}/api/users`;
  private http = inject(HttpClient);

  getMe(): Observable<UserProfileDto> {
    return this.http.get<UserProfileDto>(`${this.baseUrl}/me`);
  }

  checkEmailAvailability(email: string): Observable<EmailAvailabilityDto> {
    const params = new HttpParams().set('email', email);
    return this.http.get<EmailAvailabilityDto>(`${this.baseUrl}/check-email`, {
      params,
    });
  }

  updateMe(payload: UpdateProfileCommand, avatarFile?: File | null): Observable<void> {
    const formData = new FormData();
    formData.append('firstName', payload.firstName);
    formData.append('lastName', payload.lastName);
    formData.append('email', payload.email);

    if (payload.phoneNumber) {
      formData.append('phoneNumber', payload.phoneNumber);
    }

    if (avatarFile) {
      formData.append('avatar', avatarFile, avatarFile.name);
    }

    return this.http.put<void>(`${this.baseUrl}/me`, formData);
  }
}
