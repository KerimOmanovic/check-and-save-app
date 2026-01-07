using Market.Application.Modules.Products.Favorites.Commands.Create;
using Market.Application.Modules.Products.Favorites.Commands.Update;
using Market.Application.Modules.Products.Favorites.Commands.Delete;
using Market.Application.Modules.Products.Favorites.Queries.GetById;
using Market.Application.Modules.Products.Favorites.Queries.List;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
public class FavoritesController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateFavoriteCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task Update(int id, UpdateFavoriteCommand command, CancellationToken ct)
    {
        command.Id = id;
        await sender.Send(command, ct);
    }

    [HttpDelete("{id:int}")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteFavoriteCommand { Id = id }, ct);
    }

    [HttpGet("{id:int}")]
    public async Task<GetFavoriteByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        return await sender.Send(new GetFavoriteByIdQuery { Id = id }, ct);
    }

    [HttpGet]
    public async Task<PageResult<ListFavoritesQueryDto>> List([FromQuery] ListFavoritesQuery query, CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }
}
