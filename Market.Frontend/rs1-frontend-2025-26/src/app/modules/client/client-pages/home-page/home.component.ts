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
  category: 'namirnice' | 'elektronika' | 'drogerija' | 'akcije';
};

type CategoryTab = {
  key: CategoryKey;
  label: string;
  subtitle: string;
};

type Store = {
  name: string;
  city: string;
  hours: string;
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
    const storedCategory = localStorage.getItem(this.storageKey);
    if (storedCategory && this.isCategoryKey(storedCategory)) {
      this.activeCategory = storedCategory;
    }
  }

  stores: Store[] = [
    { name: 'Prodavnica 1', city: 'Mostar', hours: '07:00 - 21:00' },
    { name: 'Prodavnica 2', city: 'Mostar', hours: '08:00 - 22:00' },
    { name: 'Prodavnica 3', city: 'Mostar', hours: '07:30 - 20:30' },
    { name: 'Prodavnica 4', city: 'Mostar', hours: '08:00 - 21:30' },
    { name: 'Prodavnica 5', city: 'Mostar', hours: '09:00 - 20:00' },
  ];

  popularProducts: Product[] = [
    { name: 'Mlijeko', bestStore: 'Prodavnica 2', price: 2.45, category: 'namirnice' },
    { name: 'Tastatura', bestStore: 'Prodavnica 2', price: 39.9, category: 'elektronika' },
    { name: 'Šampon', bestStore: 'Prodavnica 3', price: 6.8, category: 'drogerija' },
    { name: 'Jaja', bestStore: 'Prodavnica 1', price: 3.1, category: 'namirnice' },
    { name: 'Miš', bestStore: 'Prodavnica 5', price: 19.9, category: 'elektronika' },
    { name: 'Sapun', bestStore: 'Prodavnica 5', price: 2.1, category: 'drogerija' },
  ];

  groceriesProducts: Product[] = [
    { name: 'Mlijeko', bestStore: 'Prodavnica 2', price: 2.45, category: 'namirnice' },
    { name: 'Jaja', bestStore: 'Prodavnica 1', price: 3.1, category: 'namirnice' },
    { name: 'Keks', bestStore: 'Prodavnica 4', price: 1.8, category: 'namirnice' },
    { name: 'Hljeb', bestStore: 'Prodavnica 3', price: 1.4, category: 'namirnice' },
    { name: 'Brašno', bestStore: 'Prodavnica 5', price: 2.2, category: 'namirnice' },
    { name: 'Riža', bestStore: 'Prodavnica 2', price: 3.5, category: 'namirnice' },
  ];

  electronicsProducts: Product[] = [
    { name: 'Miš', bestStore: 'Prodavnica 5', price: 19.9, category: 'elektronika' },
    { name: 'Tastatura', bestStore: 'Prodavnica 2', price: 39.9, category: 'elektronika' },
    { name: 'Punjač', bestStore: 'Prodavnica 1', price: 24.5, category: 'elektronika' },
    { name: 'USB kabl', bestStore: 'Prodavnica 4', price: 9.9, category: 'elektronika' },
  ];

  drugstoreProducts: Product[] = [
    { name: 'Šampon', bestStore: 'Prodavnica 3', price: 6.8, category: 'drogerija' },
    { name: 'Pasta za zube', bestStore: 'Prodavnica 2', price: 4.2, category: 'drogerija' },
    { name: 'Sapun', bestStore: 'Prodavnica 5', price: 2.1, category: 'drogerija' },
    { name: 'Detergent', bestStore: 'Prodavnica 1', price: 12.5, category: 'drogerija' },
  ];

  dealsProducts: Product[] = [
    { name: 'Kafa', bestStore: 'Prodavnica 3', price: 7.9, category: 'akcije' },
    { name: 'Čokolada', bestStore: 'Prodavnica 4', price: 2.3, category: 'akcije' },
    { name: 'Detergent', bestStore: 'Prodavnica 1', price: 10.9, category: 'akcije' },
    { name: 'USB kabl', bestStore: 'Prodavnica 4', price: 7.9, category: 'akcije' },
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
    if (this.activeCategory === 'popularno') return this.popularProducts;
    if (this.activeCategory === 'namirnice') return this.groceriesProducts;
    if (this.activeCategory === 'elektronika') return this.electronicsProducts;
    if (this.activeCategory === 'drogerija') return this.drugstoreProducts;
    if (this.activeCategory === 'akcije') return this.dealsProducts;
    return [];
  }

  get filteredStores(): Store[] {
    if (this.activeCategory !== 'prodavnice') return [];
    return this.stores;
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
    this.scrollTo('popular');
  }

  onCompare(p: Product): void {
    alert(`Uporedi: ${p.name} (najniža cijena: ${p.bestStore})`);
  }

  trackByName(_: number, item: { name: string }) {
    return item.name;
  }

  trackByStore(_: number, store: Store) {
    return store.name;
  }

  private isCategoryKey(value: string): value is CategoryKey {
    return this.categoryTabs.some(tab => tab.key === value);
  }
}
