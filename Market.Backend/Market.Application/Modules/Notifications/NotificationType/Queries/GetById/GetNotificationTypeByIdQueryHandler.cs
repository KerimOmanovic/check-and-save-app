namespace Market.Application.Modules.Notifications.NotificationType.Queries.GetById
{
    public sealed class GetNotificationTypeByIdQueryHandler(IAppDbContext context) : IRequestHandler<GetNotificationTypeByIdQuery, GetNotificationTypeByIdQueryDto>
    {
        public async Task<GetNotificationTypeByIdQueryDto> Handle(GetNotificationTypeByIdQuery request, CancellationToken cancellationToken)
        {
            var entity = await context.NotificationTypes
                .Where(x => x.Id == request.Id)
                .Select(x => new GetNotificationTypeByIdQueryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (entity == null)
                throw new MarketNotFoundException($"Notification type with Id {request.Id} not found.");

            return entity;
        }
    }
}
