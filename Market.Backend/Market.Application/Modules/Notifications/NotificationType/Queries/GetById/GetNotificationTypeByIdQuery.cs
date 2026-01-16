namespace Market.Application.Modules.Notifications.NotificationType.Queries.GetById
{
    public sealed class GetNotificationTypeByIdQuery : IRequest<GetNotificationTypeByIdQueryDto>
    {
        public int Id { get; set; }
    }
}
