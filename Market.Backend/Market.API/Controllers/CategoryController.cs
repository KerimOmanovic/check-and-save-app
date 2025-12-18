using Market.Application.Modules.Auth.Commands.Login;
using Market.Application.Modules.Products.Category.Commands.Create;
using Market.Application.Modules.Products.Category.Queries.List;
using MediatR;

namespace Market.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoryController(ISender sender) : ControllerBase
    {
        [HttpPost()]
        public async Task<ActionResult<int>> CreateCategory([FromBody] CreateCategoryCommand command, CancellationToken ct)
        {
            var res = await sender.Send(command);
            return Ok(res);
        }

        [HttpGet()]
        public async Task<ActionResult<PageResult<ListCategoriesQueryDto>>> GetCategories(ListCategoriesQuery query, CancellationToken ct)
        {
            var res = await sender.Send(query);
            return Ok(res);
        }
    }
}