import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../../shared/services/favorites.services';
import { CurrentUserService } from '../../../../core/services/auth/current-user.service';

type CategoryKey =
  | 'popularno'
  | 'namirnice'
  | 'elektronika'
  | 'drogerija'
  | 'prodavnice'
  | 'akcije';

type Product = {
  name: string;
  bestStore: string;
  price: number;
  category: 'namirnice' | 'elektronika' | 'drogerija';
};
type CategoryTab = {
  key: CategoryKey;
  label: string;
  subtitle: string;
};

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private favoritesService = inject(FavoritesService);
  private currentUser = inject(CurrentUserService);
  activeCategory: CategoryKey = 'popularno';
  private readonly storageKey = 'client-home-active-category';

  categoryTabs: CategoryTab[] = [
    { key: 'popularno', label: 'Popularno', subtitle: 'Top ponude danas' },
    { key: 'namirnice', label: 'Namirnice', subtitle: 'Svježe i osnovno' },
    { key: 'elektronika', label: 'Elektronika', subtitle: 'Uređaji i oprema' },
    { key: 'drogerija', label: 'Drogerija', subtitle: 'Njega i higijena' },
    { key: 'prodavnice', label: 'Prodavnice', subtitle: 'Lokacije i radno vrijeme' },
    { key: 'akcije', label: 'Akcije', subtitle: 'Aktuelni popusti' },
  ];

  ngOnInit(): void {
    const storedCategory = localStorage.getItem(this.storageKey) as CategoryKey | null;
    if (storedCategory && this.isCategoryKey(storedCategory)) {
      this.activeCategory = storedCategory;
    }
  }


  stores: string[] = [
    'Prodavnica 1',
    'Prodavnica 2',
    'Prodavnica 3',
    'Prodavnica 4',
    'Prodavnica 5',
  ];

  products: Product[] = [
    { name: 'Mlijeko', bestStore: 'Prodavnica 2', price: 2.45, category: 'namirnice' },
    { name: 'Jaja', bestStore: 'Prodavnica 1', price: 3.10, category: 'namirnice' },
    { name: 'Keks', bestStore: 'Prodavnica 4', price: 1.80, category: 'namirnice' },
    { name: 'Hljeb', bestStore: 'Prodavnica 3', price: 1.40, category: 'namirnice' },
    { name: 'Brašno', bestStore: 'Prodavnica 5', price: 2.20, category: 'namirnice' },
    { name: 'Riža', bestStore: 'Prodavnica 2', price: 3.50, category: 'namirnice' },

    { name: 'Miš', bestStore: 'Prodavnica 5', price: 19.90, category: 'elektronika' },
    { name: 'Tastatura', bestStore: 'Prodavnica 2', price: 39.90, category: 'elektronika' },
    { name: 'Punjač', bestStore: 'Prodavnica 1', price: 24.50, category: 'elektronika' },
    { name: 'USB kabl', bestStore: 'Prodavnica 4', price: 9.90, category: 'elektronika' },

    { name: 'Šampon', bestStore: 'Prodavnica 3', price: 6.80, category: 'drogerija' },
    { name: 'Pasta za zube', bestStore: 'Prodavnica 2', price: 4.20, category: 'drogerija' },
    { name: 'Sapun', bestStore: 'Prodavnica 5', price: 2.10, category: 'drogerija' },
    { name: 'Detergent', bestStore: 'Prodavnica 1', price: 12.50, category: 'drogerija' },
  ];

  favoritesCount = computed(() => this.favoritesService.favorites().length);
  isAuthenticated = computed(() => this.currentUser.isAuthenticated());

  get profileLink(): string {
    return this.isAuthenticated() ? '/client/profile' : '/auth/login';
  }

  get userLabel(): string {
    const email = this.currentUser.snapshot?.email;
    if (!email) return 'Gost';
    return email.split('@')[0] ?? 'Kupac';
  }

  get filteredProducts(): Product[] {
    if (this.activeCategory === 'popularno') return this.products.slice(0, 8);
    if (this.activeCategory === 'namirnice') return this.products.filter(p => p.category === 'namirnice');
    if (this.activeCategory === 'elektronika') return this.products.filter(p => p.category === 'elektronika');
    if (this.activeCategory === 'drogerija') return this.products.filter(p => p.category === 'drogerija');

    // za prodavnice/akcije samo pokaži popularno dok ne spojiš backend
    return this.products.slice(0, 8);
  }

  setCategory(cat: CategoryKey): void {
    this.activeCategory = cat;
    localStorage.setItem(this.storageKey, cat);

    if (cat === 'prodavnice') this.scrollTo('stores');
    else this.scrollTo('popular');
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleFavorite(productName: string): void {
    this.favoritesService.toggle(productName);
  }

  isFavorite(productName: string): boolean {
    return this.favoritesService.isFavorite(productName);
  }

  onSearch(): void {
    // kasnije spojiš sa backend pretragom
    this.scrollTo('popular');
  }

  onCompare(p: Product): void {
    // kasnije vodi na compare stranicu ili otvori dialog
    alert(`Uporedi: ${p.name} (najniža cijena: ${p.bestStore})`);
  }
  trackByName(_: number, item: { name: string }) {
    return item.name;
  }

  trackByStore(_: number, store: string) {
    return store;
  }
  private isCategoryKey(value: string): value is CategoryKey {
    return this.categoryTabs.some(tab => tab.key === value);
  }
}
