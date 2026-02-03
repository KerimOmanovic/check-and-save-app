import { PageResult } from '../../core/models/paging/page-result';
import { BasePagedQuery } from '../../core/models/paging/base-paged-query';

// === QUERIES (READ) ===

/**
 * Query parameters for GET /Branches
 * Corresponds to: ListBranchesQuery.cs
 */
export class ListBranchesQuery extends BasePagedQuery {
  storeEntityId?: number | null;
  cityEntityId?: number | null;
  onlyActive?: boolean | null;
  search?: string | null;
}

/**
 * Response item for GET /Branches
 * Corresponds to: ListBranchesQueryDto.cs
 */
export interface ListBranchesQueryDto {
  id: number;
  storeEntityId: number;
  cityEntityId: number;
  address: string;
  contact: string;
  email: string;
  isActive: boolean;
}

/**
 * Paged response for GET /Branches
 */
export type ListBranchesResponse = PageResult<ListBranchesQueryDto>;
