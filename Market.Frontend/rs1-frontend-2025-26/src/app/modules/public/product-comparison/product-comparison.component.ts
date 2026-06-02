import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { findPublicProductById, PublicProduct } from '../models/public-product.model';

@Component({
  selector: 'app-product-comparison',
  standalone: false,
  templateUrl: './product-comparison.component.html',
  styleUrl: './product-comparison.component.scss',
})
export class ProductComparisonComponent {
  protected readonly leftProduct: PublicProduct | null;
  protected readonly rightProduct: PublicProduct | null;

  constructor(private readonly route: ActivatedRoute) {
    const leftId = Number(this.route.snapshot.paramMap.get('leftId'));
    const rightId = Number(this.route.snapshot.paramMap.get('rightId'));

    this.leftProduct = Number.isFinite(leftId) ? findPublicProductById(leftId) : null;
    this.rightProduct = Number.isFinite(rightId) ? findPublicProductById(rightId) : null;
  }
}
