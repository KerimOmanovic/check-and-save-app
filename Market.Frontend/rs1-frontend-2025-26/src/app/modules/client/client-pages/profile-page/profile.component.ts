import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CurrentUserService } from '../../../../core/services/auth/current-user.service';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  private currentUser = inject(CurrentUserService);

  userEmail = computed(() => this.currentUser.snapshot?.email ?? 'Nepoznat korisnik');
  isAuthenticated = computed(() => this.currentUser.isAuthenticated());
  roleLabel = computed(() => {
    const user = this.currentUser.snapshot;
    if (!user) return 'Gost';
    if (user.isAdmin) return 'Administrator';
    if (user.isManager) return 'Menadžer';
    return 'Kupac';
  });
}
