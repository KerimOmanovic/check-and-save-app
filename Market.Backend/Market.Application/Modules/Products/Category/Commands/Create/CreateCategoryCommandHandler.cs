using Market.Domain.Entities.ProductEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Market.Application.Modules.Products.Category.Commands.Create
{
    public class CreateCategoryCommandHandler(IAppDbContext context) : IRequestHandler<CreateCategoryCommand, int>
    {
        public async Task<int> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = new Market.Domain.Entities.ProductEntities.Category
            {
                Name = request.Name,
                Description = request.Description,
            };
            await context.Categories.AddAsync(category, cancellationToken);
            await context.SaveChangesAsync(cancellationToken);
            return category.Id;
        }
    }
}