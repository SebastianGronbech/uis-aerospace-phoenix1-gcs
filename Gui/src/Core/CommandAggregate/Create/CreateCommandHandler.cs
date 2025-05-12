using MediatR;

namespace Gui.Core.CommandAggregate
{
    public class CreateCommandHandler : IRequestHandler<CreateCommandRequest, int>
    {
        private readonly ICreateCommandRepository _repository;

        public CreateCommandHandler(ICreateCommandRepository repository)
        {
            _repository = repository;
        }

        public async Task<int> Handle(CreateCommandRequest request, CancellationToken cancellationToken)
        {
            return await _repository.CreateAsync(request.CanId, request.PublicId, request.Payload, cancellationToken);
        }
    }
}
