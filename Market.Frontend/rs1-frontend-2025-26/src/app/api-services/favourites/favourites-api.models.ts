import { PageResult } from '../../core/models/paging/page-result';

export interface FavouriteProductCardDto {
  id: number;
  publicId?: string;
  productEntityId: number;
  name: string;
  price: number | null;
  imageUrl: string | null;
}
export interface FavoriteListItemDto {
  id: number;
  publicUserEntityId: number;
  productEntityId: number;
  dateAdded: string;
}

export type FavoritesListResponse = PageResult<FavoriteListItemDto>;
