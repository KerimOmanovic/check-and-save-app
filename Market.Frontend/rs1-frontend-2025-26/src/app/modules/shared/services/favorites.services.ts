import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly favoritesSet = signal<Set<string>>(new Set());

  readonly favorites = computed(() =>
    Array.from(this.favoritesSet()).sort()
  );

  toggle(productName: string): void {
    const next = new Set(this.favoritesSet()); // <- FIX: mora ()
    if (next.has(productName)) next.delete(productName);
    else next.add(productName);
    this.favoritesSet.set(next);
  }

  isFavorite(productName: string): boolean {
    return this.favoritesSet().has(productName);
  }

  clear(): void {
    this.favoritesSet.set(new Set());
  }
}
