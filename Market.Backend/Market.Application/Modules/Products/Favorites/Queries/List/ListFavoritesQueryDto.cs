namespace Market.Application.Modules.Products.Favorites.Queries.List
{
    public sealed class ListFavoritesQueryDto
    {
        public int Id { get; set; }
        public int PublicUserEntityId { get; set; }
        public int ProductEntityId { get; set; }
        public DateTime DateAdded { get; set; }
    }
}
