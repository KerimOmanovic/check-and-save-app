import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of, take } from 'rxjs';

import { DialogHelperService } from '../../../shared/services/dialog-helper.service';
import { DialogButton, DialogType } from '../../../shared/models/dialog-config.model';
import { FavouritesApiService } from '../../../../api-services/favourites/favourites-api.services';
import { ToasterService } from '../../../../core/services/toaster.service';
import { FavoritesService } from '../../../shared/services/favorites.services';
import { FavouriteProductCardDto } from '../../../../api-services/favourites/favourites-api.models';

@Component({
  selector: 'app-client-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  private dialogHelper = inject(DialogHelperService);
  private favouritesApi = inject(FavouritesApiService);
  private toaster = inject(ToasterService);
  private favoritesService = inject(FavoritesService);

  favorites: FavouriteProductCardDto[] = [];

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.syncLocalFavorites();
    this.favouritesApi.getAll().pipe(take(1)).subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.favorites = res;
        }
      },
      error: () => {
        if (this.favorites.length === 0) {
          this.toaster.error('Učitavanje omiljenih proizvoda nije uspjelo.');
        }
      }
    });
  }

  confirmRemove(item: FavouriteProductCardDto): void {
    this.dialogHelper
      .open({
        type: DialogType.WARNING,
        title: 'Ukloniti iz omiljenih?',
        message: `Proizvod "${item.name}" će biti uklonjen iz vaše liste omiljenih proizvoda.`,
        icon: 'delete_forever',
        buttons: [
          { type: DialogButton.CANCEL },
          { type: DialogButton.DELETE, color: 'warn' }
        ]
      })
      .pipe(take(1))
      .subscribe((result: any) => {
        if (result?.button !== DialogButton.DELETE) {
          return;
        }

        const favoritePublicId = item.publicId ?? item.id.toString();

        if (this.isLocalFavorite(favoritePublicId)) {
          this.removeFromLocalState(favoritePublicId);
          this.toaster.success('Proizvod je uspješno uklonjen iz omiljenih.');
          return;
        }

        this.favouritesApi.delete(favoritePublicId).pipe(take(1)).subscribe({
          next: () => {
            this.removeFromLocalState(favoritePublicId);
            this.toaster.success('Proizvod je uspješno uklonjen iz omiljenih.');
          },
          error: () => {
            this.toaster.error('Brisanje iz omiljenih nije uspjelo. Pokušajte ponovo.');
          }
        });
      });
  }

  clearAll(): void {
    if (this.favorites.length === 0) {
      return;
    }

    this.dialogHelper
      .open({
        type: DialogType.WARNING,
        title: 'Očistiti cijelu listu?',
        message: 'Svi proizvodi će biti uklonjeni iz omiljenih.',
        icon: 'delete_sweep',
        buttons: [
          { type: DialogButton.CANCEL },
          { type: DialogButton.DELETE, color: 'warn' }
        ]
      })
      .pipe(take(1))
      .subscribe((result: any) => {
        if (result?.button !== DialogButton.DELETE) {
          return;
        }

        const deletions = this.favorites
          .map((x) => x.publicId ?? x.id.toString())
          .filter((publicId) => !this.isLocalFavorite(publicId))
          .map((publicId) => this.favouritesApi.delete(publicId));
        (deletions.length ? forkJoin(deletions) : of([])).pipe(take(1)).subscribe({
          next: () => {
            this.favoritesService.clear();
            this.favorites = [];
            this.toaster.success('Lista omiljenih je očišćena.');
          },
          error: () => {
            this.toaster.error('Čišćenje liste nije uspjelo. Pokušajte ponovo.');
          }
        });
      });
  }

  trackById(_: number, item: FavouriteProductCardDto): string {
    return item.publicId ?? item.id.toString();
  }
  private syncLocalFavorites(): void {
    const localFavorites = this.favoritesService.favorites();

    if (localFavorites.length > 0) {
      this.favorites = localFavorites;
    }
  }

  private removeFromLocalState(publicId: string): void {
    this.favoritesService.removeByPublicId(publicId);
    this.favorites = this.favorites.filter((x) => (x.publicId ?? x.id.toString()) !== publicId);
  }

  private isLocalFavorite(publicId: string): boolean {
    return publicId.startsWith('local-') || this.favoritesService.hasPublicId(publicId);
  }
}
