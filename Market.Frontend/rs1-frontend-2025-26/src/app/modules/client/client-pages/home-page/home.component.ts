import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  activeCategory: CategoryKey = 'popularno';

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

  favorites = new Set<string>();

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

    if (cat === 'prodavnice') this.scrollTo('stores');
    else this.scrollTo('popular');
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleFavorite(productName: string): void {
    if (this.favorites.has(productName)) this.favorites.delete(productName);
    else this.favorites.add(productName);
  }

  isFavorite(productName: string): boolean {
    return this.favorites.has(productName);
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

}
