namespace Market.Application.Modules.Notifications.NotificationType.Queries.List
{
    public sealed class ListNotificationTypesQuery : BasePagedQuery<ListNotificationTypesQueryDto>
    {
        public string? Search { get; init; }
    }
}
