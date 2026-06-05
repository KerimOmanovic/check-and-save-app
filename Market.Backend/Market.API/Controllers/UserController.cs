using Market.Application.Modules.Identity.User.Commands.Create;
using Market.Application.Modules.Identity.User.Commands.Delete;
using Market.Application.Modules.Identity.User.Commands.Status.Disable;
using Market.Application.Modules.Identity.User.Commands.Status.Enable;
using Market.Application.Modules.Identity.User.Commands.Update;
using Market.Application.Modules.Identity.User.Queries.GetById;
using Market.Application.Modules.Identity.User.Queries.List;
using Market.Application.Abstractions;

namespace Market.API.Controllers;

[ApiController]
[Route("api/users")]
public class UserController(ISender sender, IAppCurrentUser currentUser) : ControllerBase
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
    [HttpGet("me")]
    public async Task<ActionResult<UserProfileDto>> GetMe(CancellationToken ct)
    {
        if (currentUser.UserId is null)
        {
            return Unauthorized();
        }

        var user = await sender.Send(new GetMarketUserByIdQuery { Id = currentUser.UserId.Value }, ct);

        return Ok(new UserProfileDto
        {
            Id = user.Id,
            FirstName = user.Firstname,
            LastName = user.Lastname,
            Email = user.Email,
            IsAdmin = user.IsAdmin,
            IsManager = user.IsManager,
            IsPublicUser = user.IsPublicUser
        });
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
public sealed class UserProfileDto
{
    public required int Id { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required string Email { get; init; }
    public required bool IsAdmin { get; init; }
    public required bool IsManager { get; init; }
    public required bool IsPublicUser { get; init; }
}