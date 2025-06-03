using MediatR;
using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;

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

            // Normalize hex string (remove "0x" if present)
            var normalized = payloadStr.StartsWith("0x", StringComparison.OrdinalIgnoreCase)
                ? payloadStr[2..]
                : payloadStr;

            if (!ulong.TryParse(normalized, NumberStyles.HexNumber, null, out var payload))
            {
                return $"Invalid hexadecimal payload format for '{request.PublicId}'";
            }

            var command = new Command(canId, payload);
            await _portSender.SendAsync(command);

            return $"Command 0x{command.CanId:X} with payload 0x{command.Payload:X} sent for public ID '{request.PublicId}'";
        }
    }
}
