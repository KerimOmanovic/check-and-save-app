using Market.Application.Modules.Products.Product.Commands.Create;
using Market.Application.Modules.Products.Product.Commands.Update;
using Market.Application.Modules.Products.Product.Commands.Delete;
using Market.Application.Modules.Products.Product.Queries.GetById;
using Market.Application.Modules.Products.Product.Queries.List;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateProductCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task Update(int id, UpdateProductCommand command, CancellationToken ct)
    {
       
        command.Id = id;
        await sender.Send(command, ct);
       
    }

    [HttpDelete("{id:int}")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteProductCommand { Id = id }, ct);
    
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<GetProductByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        return await sender.Send(new GetProductByIdQuery { Id = id }, ct);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<PageResult<ListProductsQueryDto>> List(
        [FromQuery] ListProductsQuery query,
        CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }
}
