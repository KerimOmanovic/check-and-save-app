import { Component } from '@angular/core';

interface GlobalAction {
  icon: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-search-products',
  standalone: false,
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.scss',
})
export class SearchProductsComponent {
  query = '';
  activeTag = 'Popularno';

  quickTags = ['Popularno', 'Akcije', 'Bez laktoze', 'Bio/eko', 'Higijena', 'Pića'];

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
  }
  onSearch(): void {
    if (!this.query.trim()) {
      return;
    }
  }
}
