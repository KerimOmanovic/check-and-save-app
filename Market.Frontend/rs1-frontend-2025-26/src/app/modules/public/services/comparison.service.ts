import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComparisonService {
  private readonly selectedProductIdsSubject = new BehaviorSubject<number[]>([]);
  readonly selectedProductIds$ = this.selectedProductIdsSubject.asObservable();

  get selectedProductIds(): number[] {
    return this.selectedProductIdsSubject.value;
  }

  setSelectedProductIds(productIds: number[]): void {
    const uniqueIds = productIds
      .filter((id) => Number.isFinite(id) && id > 0)
      .filter((id, index, ids) => ids.indexOf(id) === index);

    this.selectedProductIdsSubject.next(uniqueIds);
  }

  clear(): void {
    this.selectedProductIdsSubject.next([]);
  }
}
