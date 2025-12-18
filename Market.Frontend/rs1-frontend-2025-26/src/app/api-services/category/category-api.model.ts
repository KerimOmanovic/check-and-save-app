import {BasePagedQuery} from '../../core/models/paging/base-paged-query';
import {PageResult} from '../../core/models/paging/page-result';

export interface ListCategoriesQueryDto {
  id: number;
  name: string;
  description: string;
}
export interface ListCategoriesQuery extends BasePagedQuery {
  search?: string;
}
export type ListCategoriesQueryResponse = PageResult<ListCategoriesQueryDto>;
