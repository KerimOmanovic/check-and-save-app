import {Component, inject} from '@angular/core';
import {CategoriesApiService} from '../../../api-services/category/category-api.service';
import {Observable} from 'rxjs';
import {ListCategoriesQueryResponse} from '../../../api-services/category/category-api.model';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
    private apiService = inject(CategoriesApiService);
    public categories: ListCategoriesQueryResponse[] = [];
}
