namespace Market.Application.Modules.Notifications.NotificationType.Commands.Delete
{
    public sealed class DeleteNotificationTypeCommand : IRequest<Unit>
    {
        public required int Id { get; set; }
    }
}
