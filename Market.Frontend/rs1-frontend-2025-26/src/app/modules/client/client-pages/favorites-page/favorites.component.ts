import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of, take } from 'rxjs';

import { DialogHelperService } from '../../../shared/services/dialog-helper.service';
import { DialogButton, DialogType } from '../../../shared/models/dialog-config.model';
import { FavouritesApiService } from '../../../../api-services/favourites/favourites-api.services';
import { ToasterService } from '../../../../core/services/toaster.service';
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

  favorites: FavouriteProductCardDto[] = [];

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favouritesApi.getAll().pipe(take(1)).subscribe({
      next: (res) => {
        this.favorites = res;
      },
      error: () => {
        this.toaster.error('Učitavanje omiljenih proizvoda nije uspjelo.');
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

        this.favouritesApi.delete(item.id).pipe(take(1)).subscribe({
          next: () => {
            this.favorites = this.favorites.filter(x => x.id !== item.id);
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

        const deletions = this.favorites.map((x) => this.favouritesApi.delete(x.id));
        (deletions.length ? forkJoin(deletions) : of([])).pipe(take(1)).subscribe({
          next: () => {
            this.favorites = [];
            this.toaster.success('Lista omiljenih je očišćena.');
          },
          error: () => {
            this.toaster.error('Čišćenje liste nije uspjelo. Pokušajte ponovo.');
          }
        });
      });
  }

  trackById(_: number, item: FavouriteProductCardDto): number {
    return item.id;
  }
}
