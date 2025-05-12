using MediatR;

namespace Gui.Core.CommandAggregate
{
    public class SendCommandHandler : IRequestHandler<SendCommandRequest, string>
    {
        private readonly ICommandRepository _repository;
        private readonly IPortSender _portSender;

        public SendCommandHandler(ICommandRepository repository, IPortSender portSender)
        {
            _repository = repository;
            _portSender = portSender;
        }

        public async Task<string> Handle(SendCommandRequest request, CancellationToken cancellationToken)
        {
            var result = await _repository.FindByPublicIdAsync(request.PublicId, cancellationToken);

            if (result == null)
            {
                return $"No command found for public ID '{request.PublicId}'";
            }

            var (canId, payloadStr) = result.Value;

            if (!ulong.TryParse(payloadStr, out var payload))
            {
                return $"Invalid payload format for '{request.PublicId}'";
            }

            var command = new Command(canId, payload);
            await _portSender.SendAsync(command);

            return $"Command {command.CanId} sent for public ID '{request.PublicId}'";
        }
    }
}
