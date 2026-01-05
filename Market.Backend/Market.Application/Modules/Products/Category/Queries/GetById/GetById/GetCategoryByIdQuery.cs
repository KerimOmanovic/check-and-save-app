namespace Market.Application.Modules.Products.Category.Queries.GetById.GetById
{
    public sealed class GetCategoryByIdQuery : IRequest<GetCategoryByIdQueryDto>
    {
        public int Id { get; set; }
    }
}
