using MediatR;

namespace Gui.Core.CommandAggregate
{
    public class DeleteCommandHandler : IRequestHandler<DeleteCommandRequest, bool>
    {
        private readonly IDeleteCommandRepository _repository;

        public DeleteCommandHandler(IDeleteCommandRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> Handle(DeleteCommandRequest request, CancellationToken cancellationToken)
        {
            return await _repository.DeleteByPublicIdAsync(request.PublicId, cancellationToken);
        }
    }
}
