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
import { Observable, catchError, finalize, map, of, switchMap, timer } from 'rxjs';
import { UsersApiService } from '../../../../api-services/users/users-api.services';
import { UpdateProfileCommand, UserProfileDto } from '../../../../api-services/users/users-api.model';
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
  private readonly currentUser = inject(CurrentUserService);

  isLoading = true;
  isSaving = false;
  loadError = '';
  saveError = '';
  saveSuccess = '';
  avatarPreview: string | null = null;

  private currentEmail = '';
  private userId = '';

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
    this.saveError = '';
    this.saveSuccess = '';

    if (this.form.pending) {
      this.saveError = 'Sačekajte da se završi provjera email adrese.';
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.saveError = 'Provjerite unesene podatke prije spremanja.';
      return;
    }

    if (!this.currentUser.isAuthenticated()) {
      this.saveError = 'Sesija je istekla. Prijavite se ponovo.';
      return;
    }

    if (!this.userId) {
      this.saveError = 'Nije moguće pronaći korisnika za ažuriranje.';
      return;
    }

    const value = this.form.getRawValue();

    const payload: UpdateProfileCommand = {
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      email: value.email.trim(),
      phoneNumber: value.phoneNumber.trim() || null,
    };

    this.isSaving = true;

    this.usersApi
      .updateByPublicId(this.userId, payload, value.avatar)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.form.patchValue({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            phoneNumber: payload.phoneNumber ?? '',
            avatar: null,
          });

          this.currentEmail = payload.email;
          this.form.markAsPristine();
          this.saveSuccess = 'Profil je uspješno ažuriran.';
          this.scrollToStatusMessage();
        },
        error: (error: unknown) => {
          this.saveError = this.getSaveErrorMessage(error);
          this.scrollToStatusMessage();
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
      next: (user: UserProfileDto) => {
        this.patchForm(user);
        this.userId = String(user.id);
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

  private getSaveErrorMessage(error: unknown): string {
    if (this.isConflictError(error)) {
      return 'Ovaj email je već zauzet.';
    }

    return 'Neuspješno spremanje profila. Pokušajte ponovo.';
  }

  private isConflictError(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'status' in error && error.status === 409;
  }

  private scrollToStatusMessage(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
