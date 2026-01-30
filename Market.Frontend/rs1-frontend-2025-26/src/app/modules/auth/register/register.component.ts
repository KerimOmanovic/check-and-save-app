// // import { Component } from '@angular/core';
// //
// // @Component({
// //   selector: 'app-register',
// //   standalone: false,
// //   templateUrl: './register.component.html',
// //   styleUrl: './register.component.scss',
// // })
// // export class RegisterComponent {
// //
// // }
// // register.component.ts
// import { Component, inject } from '@angular/core';
// import { HttpErrorResponse } from '@angular/common/http';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { switchMap } from 'rxjs';
// import { AuthApiService } from '../../../api-services/auth/auth-api.service';
// import { LoginCommand, RegisterCommand } from '../../../api-services/auth/auth-api.model';
// import { AuthFacadeService } from '../../../core/services/auth/auth-facade.service';
// import { CurrentUserService } from '../../../core/services/auth/current-user.service';
//
// @Component({
//   selector: 'app-register',
//   standalone: false,
//   templateUrl: './register.component.html',
//   styleUrl: './register.component.scss',
// })
// export class RegisterComponent {
//   private authApi = inject(AuthApiService);
//   private auth = inject(AuthFacadeService);
//   private router = inject(Router);
//   private currentUser = inject(CurrentUserService);
//   form: FormGroup;
//
//   hidePassword = true;
//   hideConfirmPassword = true;
//
//   isLoading = false;
//   errorMessage = '';
//   successMessage = '';
//
//   constructor(private fb: FormBuilder) {
//     this.form = this.fb.group(
//       {
//         firstName: ['', [Validators.required, Validators.minLength(2)]],
//         lastName: ['', [Validators.required, Validators.minLength(2)]],
//         email: ['', [Validators.required, Validators.email]],
//         password: ['', [Validators.required, Validators.minLength(6)]],
//         confirmPassword: ['', [Validators.required]],
//       },
//       { validators: [this.passwordsMatchValidator] }
//     );
//   }
//
//   private passwordsMatchValidator(group: FormGroup) {
//     const p = group.get('password')?.value;
//     const c = group.get('confirmPassword')?.value;
//     return p && c && p !== c ? { passwordsMismatch: true } : null;
//   }
//
//   onSubmit(): void {
//     this.errorMessage = '';
//     this.successMessage = '';
//
//     if (this.form.invalid|| this.isLoading)  {
//       this.form.markAllAsTouched();
//       return;
//     }
//
//     this.isLoading = true;
//
//     const payload: RegisterCommand = {
//       firstName: this.form.value.firstName ?? '',
//       lastName: this.form.value.lastName ?? '',
//       email: this.form.value.email ?? '',
//       password: this.form.value.password ?? ''
//     };
//
//
//     // const loginPayload: LoginCommand = {
//     //   email: payload.email,
//     //   password: payload.password,
//     //   fingerprint: null,
//     // };
//     //
//     // const payload: RegisterCommand = {
//     //   firstName: this.form.value.firstName ?? '',
//     //   lastName: this.form.value.lastName ?? '',
//     //   email: this.form.value.email ?? '',
//     //   password: this.form.value.password ?? ''
//     // };
//     const loginPayload: LoginCommand = {
//       email: this.form.value.email ?? '',
//       password: this.form.value.password ?? '',
//       fingerprint: null,
//     };
//
//     const registerPayload: RegisterCommand = {
//       firstName: this.form.value.firstName ?? '',
//       lastName: this.form.value.lastName ?? '',
//       email: this.form.value.email ?? '',
//       password: this.form.value.password ?? '',
//     };
//
//     this.authApi.register(registerPayload).subscribe({
//       next: () => {
//         this.isLoading = false;
//         this.successMessage = 'Registracija uspješna. Sada se možeš prijaviti.';
//         this.form.reset();
//         this.hidePassword = true;
//         this.hideConfirmPassword = true;
//       },
//       error: (err: unknown) => {
//         this.isLoading = false;
//         const apiError = err as { error?: { message?: string; title?: string } };
//         this.errorMessage =
//           apiError?.error?.message ||
//           apiError?.error?.title ||
//           'Registracija nije uspjela. Pokušaj ponovo.';
//       }
//     });
//   }
// }
import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { AuthApiService } from '../../../api-services/auth/auth-api.service';
import { LoginCommand, RegisterCommand } from '../../../api-services/auth/auth-api.model';
import { AuthFacadeService } from '../../../core/services/auth/auth-facade.service';
import { CurrentUserService } from '../../../core/services/auth/current-user.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private authApi = inject(AuthApiService);
  private auth = inject(AuthFacadeService);
  private router = inject(Router);
  private currentUser = inject(CurrentUserService);

  hidePassword = true;
  hideConfirmPassword = true;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [this.passwordsMatchValidator] }
    );
  }

  private passwordsMatchValidator(group: FormGroup) {
    const p = group.get('password')?.value;
    const c = group.get('confirmPassword')?.value;
    return p && c && p !== c ? { passwordsMismatch: true } : null;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const registerPayload: RegisterCommand = {
      firstName: this.form.value.firstName ?? '',
      lastName: this.form.value.lastName ?? '',
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
    };

    const loginPayload: LoginCommand = {
      email: registerPayload.email,
      password: registerPayload.password,
      fingerprint: null,
    };

    this.isLoading = true;

    const registerPayload: RegisterCommand = {
      firstName: this.form.value.firstName ?? '',
      lastName: this.form.value.lastName ?? '',
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
    };

    const loginPayload: LoginCommand = {
      email: registerPayload.email,
      password: registerPayload.password,
      fingerprint: null,
    };

    this.authApi.register(registerPayload).pipe(
      switchMap(() => this.auth.login(loginPayload))
    ).subscribe({
      next: () => {
        this.isLoading = false;

        // isto kao u LoginComponent
        const target = this.currentUser.getDefaultRoute();
        this.router.navigate([target]);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message ||
          err?.error?.title ||
          'Registracija ili prijava nije uspjela. Pokušaj ponovo.';
      }
    });

  }
}
