import { Injectable, computed, signal } from '@angular/core';
import { FavouriteProductCardDto } from '../../../api-services/favourites/favourites-api.models';

export interface FavoriteTogglePayload {
  publicId?: string;
  price?: number | null;
  imageUrl?: string | null;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {

  private readonly favoritesMap = signal<Map<string, FavouriteProductCardDto>>(new Map());

  readonly favorites = computed(() =>
    Array.from(this.favoritesMap().values()).sort((a, b) => a.name.localeCompare(b.name))
  );


    toggle(productName: string, payload?: FavoriteTogglePayload): void {
      const key = this.normalizeKey(productName);
      const next = new Map(this.favoritesMap());

      if (next.has(key)) {
      next.delete(key);
      this.favoritesMap.set(next);
      return;
    }

    next.set(key, {
      id: this.createLocalId(productName),
      publicId: payload?.publicId ?? this.createLocalPublicId(productName),
      productEntityId: Number(payload?.publicId) || 0,
      name: productName,
      price: payload?.price ?? null,
      imageUrl: payload?.imageUrl ?? null
    });

    this.favoritesMap.set(next);
  }

  isFavorite(productName: string): boolean {
    return this.favoritesMap().has(this.normalizeKey(productName));
  }

  removeByPublicId(publicId: string): void {
    const next = new Map(this.favoritesMap());
    const entry = Array.from(next.entries()).find(([, item]) => item.publicId === publicId);

    if (entry) {
      next.delete(entry[0]);
      this.favoritesMap.set(next);
    }
  }
  clear(): void {
    this.favoritesMap.set(new Map());
  }

  private normalizeKey(name: string): string {
    return name.trim().toLowerCase();
  }

  private createLocalPublicId(name: string): string {
    return `local-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  }

  private createLocalId(name: string): number {
    const normalized = name.toLowerCase().replace(/[^a-z0-9]+/g, '');
    let hash = 0;

    for (let i = 0; i < normalized.length; i++) {
      hash = ((hash << 5) - hash) + normalized.charCodeAt(i);
      hash |= 0;
    }

    return Math.abs(hash);
  }
}
