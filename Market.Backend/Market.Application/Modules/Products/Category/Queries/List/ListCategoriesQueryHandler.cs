using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Application.Modules.Products.Category.Queries.List
{
    public class ListCategoriesQueryHandler(IAppDbContext context) : IRequestHandler<ListCategoriesQuery, PageResult<ListCategoriesQueryDto>>
    {
        public async Task<PageResult<ListCategoriesQueryDto>> Handle(ListCategoriesQuery request, CancellationToken cancellationToken)
        {
            var q = context.Categories.AsNoTracking();
            if (!string.IsNullOrEmpty(request.Search))
            {
                q = q.Where(x => x.Name.ToLower().StartsWith(request.Search));
            }
            var pq = q.Select(x => new ListCategoriesQueryDto
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description
            });
            return await PageResult<ListCategoriesQueryDto>.FromQueryableAsync(pq, request.Paging, cancellationToken);
        }
    }
}