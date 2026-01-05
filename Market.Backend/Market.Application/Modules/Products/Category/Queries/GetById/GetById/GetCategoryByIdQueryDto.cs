namespace Market.Application.Modules.Products.Category.Queries.GetById.GetById
{
    public sealed class GetCategoryByIdQueryDto
    {
        public required int Id { get; init; }
        public required string Name { get; init; }
        public string? Description { get; init; }
    }
}
