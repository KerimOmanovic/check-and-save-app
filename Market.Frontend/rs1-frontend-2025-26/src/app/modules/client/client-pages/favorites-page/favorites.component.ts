import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../../shared/services/favorites.services';


@Component({
  selector: 'app-client-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);

  // samo preuzmi signal iz servisa
  favorites = this.favoritesService.favorites;

  remove(productName: string): void {
    this.favoritesService.toggle(productName);
  }

  clearAll(): void {
    this.favoritesService.clear();
  }
}
