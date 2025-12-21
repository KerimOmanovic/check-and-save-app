import {Component, inject, OnInit} from '@angular/core';
import {CategoriesApiService} from '../../../api-services/category/category-api.service';
import {Observable} from 'rxjs';
import {ListCategoriesQueryDto, ListCategoriesQueryResponse} from '../../../api-services/category/category-api.model';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit  {
    private apiService = inject(CategoriesApiService);
    public categories: ListCategoriesQueryDto[] = [];
    ngOnInit(){
      this.apiService.list().subscribe((res)=>{
        this.categories = res.items;
      })
    }
}
