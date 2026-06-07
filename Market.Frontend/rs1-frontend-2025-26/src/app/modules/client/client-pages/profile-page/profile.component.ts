import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UsersApiService } from '../../../../api-services/users/users-api.services';
import { UserProfileDto } from '../../../../api-services/users/users-api.model';
import { CurrentUserService } from '../../../../core/services/auth/current-user.service';
import { ThemeService } from '../../../../core/services/theme/theme.service';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, MatSlideToggleModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private readonly currentUser = inject(CurrentUserService);
  private readonly usersApi = inject(UsersApiService);
  readonly themeService = inject(ThemeService);

  profile = signal<UserProfileDto | null>(null);
  isLoading = signal(true);
  loadError = signal('');

  userEmail = computed(
    () => this.profile()?.email ?? this.currentUser.snapshot?.email ?? 'Nepoznat korisnik',
  );
  isAuthenticated = computed(() => this.currentUser.isAuthenticated());
  roleLabel = computed(() => {
    const profile = this.profile();
    const user = this.currentUser.snapshot;
    if (!profile && !user) return 'Gost';
    if (profile?.isAdmin || user?.isAdmin) return 'Administrator';
    if (profile?.isManager || user?.isManager) return 'Menadžer';
    return 'Kupac';
  });
  fullName = computed(() => {
    const firstName = this.profile()?.firstName?.trim() ?? '';
    const lastName = this.profile()?.lastName?.trim() ?? '';

    return `${firstName} ${lastName}`.trim() || 'Nepoznato ime';
  });

  themeLabel = computed(() => (this.themeService.isDarkTheme() ? 'Tamna tema' : 'Svijetla tema'));

  avatarImageSrc = computed(() =>
    this.profile()?.avatarLevel === 1
      ? 'assets/avatars/male.avatar.svg'
      : 'assets/avatars/female.avatar.svg',
  );

  onThemeToggle(event: MatSlideToggleChange): void {
    this.themeService.setTheme(event.checked ? 'dark' : 'light');
  }

  ngOnInit(): void {
    if (!this.currentUser.isAuthenticated()) {
      this.isLoading.set(false);
      return;
    }

    this.usersApi.getMe().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set('Neuspješno učitavanje profila. Pokušajte ponovo.');
        this.isLoading.set(false);
      },
    });
  }
}
