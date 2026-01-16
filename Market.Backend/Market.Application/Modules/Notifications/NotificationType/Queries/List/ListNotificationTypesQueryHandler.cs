namespace Market.Application.Modules.Notifications.NotificationType.Queries.List
{
    public sealed class ListNotificationTypesQueryHandler(IAppDbContext ctx) : IRequestHandler<ListNotificationTypesQuery, PageResult<ListNotificationTypesQueryDto>>
    {
        public async Task<PageResult<ListNotificationTypesQueryDto>> Handle(
       ListNotificationTypesQuery request, CancellationToken ct)
        {
            var q = ctx.NotificationTypes.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(request.Search))
                q = q.Where(x => x.Name.Contains(request.Search));

            var projected = q.OrderBy(x => x.Name)
                .Select(x => new ListNotificationTypesQueryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description
                });

            return await PageResult<ListNotificationTypesQueryDto>
                .FromQueryableAsync(projected, request.Paging, ct);
        }
    }
}
