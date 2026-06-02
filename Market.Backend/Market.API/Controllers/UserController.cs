using Market.Application.Modules.Identity.User.Commands.Create;
using Market.Application.Modules.Identity.User.Commands.Delete;
using Market.Application.Modules.Identity.User.Commands.Status.Disable;
using Market.Application.Modules.Identity.User.Commands.Status.Enable;
using Market.Application.Modules.Identity.User.Commands.Update;
using Market.Application.Modules.Identity.User.Queries.GetById;
using Market.Application.Modules.Identity.User.Queries.List;

namespace Market.API.Controllers;

[ApiController]
[Route("api/users")]
public class UserController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> Create(
        [FromBody] CreateMarketUserCommand command,
        CancellationToken ct)
    {
        int id = await sender.Send(command, ct);

        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task Update(
        int id,
        [FromBody] UpdateMarketUserCommand command,
        CancellationToken ct)
    {
        command.Id = id;
        await sender.Send(command, ct);
    }

    // FIX: promijenjen route i naziv metode
    [HttpPut("{id:int}/public-id")]
    public async Task<ActionResult<UpdateUserPubIdCommandDto>> UpdatePublicId(
        int id,
        [FromBody] UpdateUserPubIdCommand command,
        CancellationToken ct)
    {
        command.Id = id;

        var updatedUser = await sender.Send(command, ct);

        return Ok(updatedUser);
    }

    [HttpDelete("{id:int}")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteMarketUserCommand { Id = id }, ct);
    }

    [HttpPut("{id:int}/disable")]
    public async Task Disable(int id, CancellationToken ct)
    {
        await sender.Send(new DisableMarketUserCommand { Id = id }, ct);
    }

    [HttpPut("{id:int}/enable")]
    public async Task Enable(int id, CancellationToken ct)
    {
        await sender.Send(new EnableMarketUserCommand { Id = id }, ct);
    }

    [HttpGet("{id:int}")]
    public async Task<GetMarketUserByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        return await sender.Send(new GetMarketUserByIdQuery { Id = id }, ct);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<PageResult<ListMarketUsersQueryDto>> List(
        [FromQuery] ListMarketUsersQuery query,
        CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }
}