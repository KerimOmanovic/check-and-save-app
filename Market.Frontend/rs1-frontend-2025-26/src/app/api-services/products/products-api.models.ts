import { PageResult } from '../../core/models/paging/page-result';
import { BasePagedQuery } from '../../core/models/paging/base-paged-query';

// === QUERIES (READ) ===

/**
 * Query parameters for GET /Product
 * Corresponds to: ListProductsQuery.cs
 */
export class ListProductsQuery extends BasePagedQuery {
  search?: string | null;
  branchEntityId?: number | null;
  categoryEntityId?: number | null;
  brandEntityId?: number | null;
}

/**
 * Response item for GET /Product
 * Corresponds to: ListProductsQueryDto.cs
 */
export interface ListProductsQueryDto {
  id: number;
  branchEntityId: number;
  categoryEntityId: number;
  brandEntityId: number;
  name: string;
  storeEntityId: number;
  dateAdded: string;
}

/**
 * Response for GET /Product/{id}
 * Corresponds to: GetProductByIdQueryDto.cs
 */
export interface GetProductByIdQueryDto {
  id: number;
  storeEntityId: number;
  branchEntityId: number;
  categoryEntityId: number;
  brandEntityId: number;
  name: string;
  description: string;
  imageURL: string;
  dateAdded: string;
}

/**
 * Paged response for GET /Product
 */
export type ListProductsResponse = PageResult<ListProductsQueryDto>;
