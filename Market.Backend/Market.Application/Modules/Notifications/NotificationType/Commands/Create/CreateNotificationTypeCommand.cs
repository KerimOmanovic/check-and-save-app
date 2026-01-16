namespace Market.Application.Modules.Notifications.NotificationType.Commands.Create
{
    public sealed class CreateNotificationTypeCommand : IRequest<int>
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
    }
}
