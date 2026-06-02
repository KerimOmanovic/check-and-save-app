// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { CurrentUserService } from '../services/auth/current-user.service';
import { ToasterService } from '../services/toaster.service';

export const myAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const currentUser = inject(CurrentUserService);
  const router = inject(Router);
  const toaster = inject(ToasterService);

  const authData = (route.data?.['auth'] ?? route.data) as MyAuthRouteData | undefined;
  const requireAuth = authData?.requireAuth === true;
  const requireAdmin = authData?.requireAdmin === true;
  const requireManager = authData?.requireManager === true;
  const requirePublicUser = authData?.requirePublicUser === true;

  const isAuth = currentUser.isAuthenticated();

  // 1) ako ruta traži auth, a user nije logiran → login
  if (requireAuth && !isAuth) {
    toaster.warning('Prijavite se da biste pristupili ovoj stranici.');
    router.navigate(['/auth/login']);
    return false;
  }

  // Ako ne traži auth → pusti (javne rute)
  if (!requireAuth) {
    return true;
  }

  // 2) role check – admin > manager > public user
  const user = currentUser.snapshot;
  if (!user) {
    toaster.warning('Prijavite se da biste nastavili.');
    router.navigate(['/auth/login']);
    return false;
  }

  if (requireAdmin && !user.isAdmin) {
    toaster.error('Nemate dozvolu za pristup administratorskom dijelu.');
    router.navigate([currentUser.getDefaultRoute()]);
    return false;
  }

  if (requireManager && !user.isManager) {
    toaster.error('Nemate dozvolu za pristup managerskom dijelu.');
    router.navigate([currentUser.getDefaultRoute()]);
    return false;
  }

  if (requirePublicUser && !user.isPublicUser) {
    toaster.error('Nemate dozvolu za pristup korisničkom dijelu.');
    router.navigate([currentUser.getDefaultRoute()]);
    return false;
  }

  return true;
};

export interface MyAuthRouteData {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireManager?: boolean;
  requirePublicUser?: boolean;
}

export function myAuthData(data: MyAuthRouteData): MyAuthRouteData {
  return data;
}
