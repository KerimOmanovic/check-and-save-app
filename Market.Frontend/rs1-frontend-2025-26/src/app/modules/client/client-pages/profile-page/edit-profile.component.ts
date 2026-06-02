import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Observable, catchError, map, of, switchMap, timer } from 'rxjs';
import { UsersApiService } from '../../../../api-services/users/users-api.services';
import {
  UpdateProfileCommand,
  UserProfileDto,
} from '../../../../api-services/users/users-api.model';
import { AuthFacadeService } from '../../../../core/services/auth/auth-facade.service';
import { CurrentUserService } from '../../../../core/services/auth/current-user.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usersApi = inject(UsersApiService);
  private readonly auth = inject(AuthFacadeService);
  private readonly currentUser = inject(CurrentUserService);

  isLoading = true;
  isSaving = false;
  loadError = '';
  saveError = '';
  saveSuccess = '';
  avatarPreview: string | null = null;
  private currentEmail = '';
  private selectedAvatarFile: File | null = null;

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(120)]],
    lastName: ['', [Validators.required, Validators.maxLength(120)]],
    email: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.email, Validators.maxLength(200)],
      asyncValidators: [this.emailAvailabilityValidator()],
      updateOn: 'blur',
    }),
    phoneNumber: ['', [Validators.maxLength(40)]],
    avatar: this.fb.control<File | null>(null),
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedAvatarFile = file;
    this.form.controls.avatar.setValue(file);

    if (!file) {
      this.avatarPreview = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = typeof reader.result === 'string' ? reader.result : null;
    };
    reader.readAsDataURL(file);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: UpdateProfileCommand = {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      phoneNumber: value.phoneNumber || null,
    };
    const publicId = this.currentUser.snapshot?.userId?.toString();

    if (!publicId) {
      this.saveError = 'Sesija je istekla. Prijavite se ponovo.';
      return;
    }

    this.saveError = '';
    this.saveSuccess = '';
    this.isSaving = true;
    this.usersApi.updateByPublicId(publicId, payload, this.selectedAvatarFile).subscribe({
      next: (response) => {
        this.auth.applyAuthBundle({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          accessTokenExpiresAtUtc: response.accessTokenExpiresAtUtc ?? response.expiresAtUtc ?? '',
          refreshTokenExpiresAtUtc: response.refreshTokenExpiresAtUtc ?? '',
        });
        this.saveSuccess = 'Profil je uspješno ažuriran.';
        this.currentEmail = payload.email;
        this.isSaving = false;
      },
      error: () => {
        this.saveError = 'Neuspješno spremanje profila. Pokušajte ponovo.';
        this.isSaving = false;
      },
    });
  }

  getAvatarInitials(): string {
    const firstName = this.form.controls.firstName.value.trim();
    const lastName = this.form.controls.lastName.value.trim();
    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName.charAt(0);

    return `${firstInitial}${lastInitial}`.trim().toUpperCase() || 'U';
  }

  private loadProfile(): void {
    this.usersApi.getMe().subscribe({
      next: (user) => {
        this.patchForm(user);
        this.currentEmail = user.email;
        this.avatarPreview = user.avatarUrl ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.loadError = 'Neuspješno učitavanje profila. Pokušajte ponovo.';
        this.isLoading = false;
      },
    });
  }

  private patchForm(user: UserProfileDto): void {
    this.form.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber ?? '',
      avatar: null,
    });
  }

  private emailAvailabilityValidator(): AsyncValidatorFn {
    return (control: AbstractControl<string>): Observable<ValidationErrors | null> => {
      const email = control.value?.trim();

      if (!email || control.hasError('email')) {
        return of(null);
      }

      if (email.toLowerCase() === this.currentEmail.toLowerCase()) {
        return of(null);
      }

      return timer(300).pipe(
        switchMap(() => this.usersApi.checkEmailAvailability(email)),
        map((result) => (result.isAvailable ? null : { emailTaken: true })),
        catchError(() => of(null)),
      );
    };
  }
}
