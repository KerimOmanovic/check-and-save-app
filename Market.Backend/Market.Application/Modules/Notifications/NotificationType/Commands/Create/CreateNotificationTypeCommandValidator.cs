using Market.Domain.Entities.NotificationEntities;

namespace Market.Application.Modules.Notifications.NotificationType.Commands.Create
{
    public sealed class CreateNotificationTypeCommandValidator : AbstractValidator<CreateNotificationTypeCommand>
    {
        public CreateNotificationTypeCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required.")
                .MaximumLength(NotificationTypeEntity.Constraints.NameMaxLength);

            RuleFor(x => x.Description)
                .MaximumLength(NotificationTypeEntity.Constraints.DescriptionMaxLength);
        }
    }
}
