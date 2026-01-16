namespace Market.Application.Modules.Notifications.NotificationType.Queries.GetById
{
    public sealed class GetNotificationTypeByIdQueryValidator : AbstractValidator<GetNotificationTypeByIdQuery>
    {
        public GetNotificationTypeByIdQueryValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0);
        }
    }
}
