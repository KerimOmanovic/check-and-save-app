import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Component } from '@angular/core';

@Component({
  selector: 'app-public-layout',
  standalone: false,
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent implements OnInit {
  currentYear: string = '2026';

  constructor(private router: Router) {}

  // Scroll to top on every route change within the public layout
  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
  }
export class PublicLayoutComponent {
  currentYear: string = "2025";

}
