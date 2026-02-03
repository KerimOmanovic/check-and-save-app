import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-map',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  stores = [
    { name: 'Prodavnica 1', address: 'Kralja Tvrtka 10, Mostar' },
    { name: 'Prodavnica 2', address: 'Rade Bitange 22, Mostar' },
    { name: 'Prodavnica 3', address: 'Aleja 3, Mostar' },
    { name: 'Prodavnica 4', address: 'Trg 1. Maj 5, Mostar' },
  ];
}
