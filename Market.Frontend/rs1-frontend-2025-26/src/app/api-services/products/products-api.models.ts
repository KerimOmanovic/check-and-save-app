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
  storeEntityId?: number | null;
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
  storeLabel?: string | null;
  lowestPrice?: number | null;
  imageUrl?: string | null;
  dateAdded: string;
}

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

export type ListProductsResponse = PageResult<ListProductsQueryDto>;

/**
 * Paged response for GET /Product
 */
export type ListProductsResponse = PageResult<ListProductsQueryDto>;
/**
 * Response for GET /api/products/compare?ids=...
 * Corresponds to: CompareProductsQueryDto.cs
 */
export interface CompareProductsQueryDto {
  products: CompareProductDto[];
}

export interface CompareProductDto {
  publicId: string;
  id: number;
  name: string;
  description: string;
  imageURL: string;
  dateAdded: string;
  categoryEntityId: number;
  categoryName: string;
  brandEntityId: number;
  brandName: string;
  prices: CompareStorePriceDto[];
}

export interface CompareStorePriceDto {
  productId: number;
  productPublicId: string;
  storeEntityId: number;
  storeName: string;
  branchEntityId: number;
  branchAddress: string;
  amount?: number | null;
  dateUpdated?: string | null;
}

// === COMMANDS (WRITE) ===

/**
 * Command for POST /Product
 * Corresponds to: CreateProductCommand.cs
 */
export interface CreateProductCommand {
  storeEntityId: number;
  branchEntityId: number;
  categoryEntityId: number;
  brandEntityId: number;
  name: string;
  description: string;
  imageURL: string;
  dateAdded: string | Date;
}

/**
 * Command for PUT /Product/{id}
 * Corresponds to: UpdateProductCommand.cs
 */
export interface UpdateProductCommand {
  storeEntityId: number;
  branchEntityId: number;
  categoryEntityId: number;
  brandEntityId: number;
  name: string;
  description: string;
  imageURL: string;
}

// === IMAGE UPLOAD ===

export interface UploadProductImageDto {
  imageUrl: string;
}
