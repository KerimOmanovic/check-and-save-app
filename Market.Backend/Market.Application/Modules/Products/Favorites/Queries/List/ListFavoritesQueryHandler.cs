namespace Market.Application.Modules.Products.Favorites.Queries.List
{
    public sealed class ListFavoritesQueryHandler(IAppDbContext ctx): IRequestHandler<ListFavoritesQuery, PageResult<ListFavoritesQueryDto>>
    {
        public async Task<PageResult<ListFavoritesQueryDto>> Handle(ListFavoritesQuery request, CancellationToken ct)
        {
            var q = ctx.Favorites.AsNoTracking();

            if (request.PublicUserEntityId.HasValue)
            {
                q = q.Where(x => x.PublicUserEntityId == request.PublicUserEntityId.Value);
            }

            var pq = q.Select(x => new ListFavoritesQueryDto
            {
                Id = x.Id,
                PublicUserEntityId = x.PublicUserEntityId,
                ProductEntityId = x.ProductEntityId,
                DateAdded = x.DateAdded
            });

            return await PageResult<ListFavoritesQueryDto>
                .FromQueryableAsync(pq, request.Paging, ct);
        }
    }
}
