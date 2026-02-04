import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';
import { CurrentUserService } from '../../../core/services/auth/current-user.service';
import { FavoritesService } from '../../shared/services/favorites.services';

interface GlobalAction {
  icon: string;
  title: string;
  subtitle: string;
}

interface ProductCard {
  name: string;
  category: string;
  store: string;
  price: number;
  badge?: string;
}


@Component({
  selector: 'app-search-products',
  standalone: false,
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.scss',
})
export class SearchProductsComponent {
  private currentUser = inject(CurrentUserService);
  private favoritesService = inject(FavoritesService);
  private router = inject(Router);
  private toaster = inject(ToasterService);
  query = '';
  activeTag = 'Popularno';
  resultsTitle = 'Najnovije preporuke';
  resultsSubtitle = 'Prikazujemo odabrane proizvode iz više prodavnica.';
  resultsCount = 0;


  quickTags = ['Popularno', 'Akcije', 'Bez laktoze', 'Bio/eko', 'Higijena', 'Pića'];

  products: ProductCard[] = [
    {
      name: 'Kafa Classic 200g',
      category: 'Pića',
      store: 'Bingo',
      price: 6.95,
      badge: 'Akcije',
    },
    {
      name: 'Mlijeko bez laktoze 1L',
      category: 'Bez laktoze',
      store: 'Konzum',
      price: 2.2,
      badge: 'Bez laktoze',
    },
    {
      name: 'Organski med 500g',
      category: 'Bio/eko',
      store: 'DM',
      price: 12.4,
      badge: 'Bio/eko',
    },
    {
      name: 'Šampon protiv peruti 400ml',
      category: 'Higijena',
      store: 'CM',
      price: 7.9,
      badge: 'Higijena',
    },
    {
      name: 'Gazirana voda 1.5L',
      category: 'Pića',
      store: 'Bingo',
      price: 1.2,
    },
    {
      name: 'Proteinski jogurt 250g',
      category: 'Popularno',
      store: 'Mercator',
      price: 2.65,
    },
    {
      name: 'Pasta za zube Herbal',
      category: 'Higijena',
      store: 'DM',
      price: 4.35,
      badge: 'Akcije',
    },
  ];

  filteredProducts: ProductCard[] = [...this.products];


  globalActions: GlobalAction[] = [
    {
      icon: 'tune',
      title: 'Filteri',
      subtitle: 'Dodaj detaljne filtere po cijeni i kategoriji.',
    },
    {
      icon: 'swap_vert',
      title: 'Sortiranje',
      subtitle: 'Posloži rezultate po najnižoj cijeni.',
    },
    {
      icon: 'storefront',
      title: 'Prodavnice',
      subtitle: 'Pregledaj dostupne prodavnice u blizini.',
    },
    {
      icon: 'favorite_border',
      title: 'Omiljeno',
      subtitle: 'Sačuvaj proizvode za kasnije upoređivanje.',
    },
  ];

  setActiveTag(tag: string): void {
    this.activeTag = tag;
    this.updateResults(this.query);
  }

  onQueryChange(value: string): void {
    this.query = value;
    this.updateResults(value);
  }
  onSearch(): void {
    this.updateResults(this.query, true);
  }
  onAddToFavorites(productName: string): void {
    if (!this.currentUser.isAuthenticated()) {
      this.toaster.warning('Prijavite se da biste dodali omiljeni proizvod.');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.favoritesService.toggle(productName);
    const isFavorite = this.favoritesService.isFavorite(productName);
    this.toaster.success(
      isFavorite ? 'Proizvod je dodan u omiljene.' : 'Proizvod je uklonjen iz omiljenih.'
    );
  }
  private updateResults(value: string, fromSubmit = false): void {
    const term = value.trim().toLowerCase();
    const activeTag = this.activeTag;

    this.filteredProducts = this.products.filter((product) => {
      const matchesTerm = !term || product.name.toLowerCase().includes(term);
      const matchesTag =
        activeTag === 'Popularno' ||
        product.category === activeTag ||
        product.badge === activeTag;
      return matchesTerm && matchesTag;
    });

    this.resultsCount = this.filteredProducts.length;

    if (!term) {
      if (this.resultsCount === 0 && activeTag !== 'Popularno') {
        this.resultsTitle = `Nema proizvoda u kategoriji ${activeTag}`;
        this.resultsSubtitle = 'Pokušajte drugi filter ili uklonite brzi tag.';
        return;
      }
      this.resultsTitle = activeTag === 'Popularno'
        ? 'Najnovije preporuke'
        : `Istaknuto za ${activeTag}`;
      this.resultsSubtitle = 'Prikazujemo odabrane proizvode iz više prodavnica.';
      return;
    }

    this.resultsTitle = fromSubmit
      ? `Rezultati pretrage za "${value.trim()}"`
      : `Pretraga u toku: "${value.trim()}"`;
    this.resultsSubtitle =
      this.resultsCount === 0
        ? 'Nema proizvoda koji odgovaraju upitu. Pokušajte drugi pojam.'
        : `Pronađeno ${this.resultsCount} proizvoda u prodavnicama.`;
  }
}
