namespace Gui.Infrastructure.Entities
{
    public class CommandEntity
    {
        public int Id { get; set; } // This is the internal CAN ID
        public string PublicIdentifier { get; set; } = string.Empty;
        public string Payload { get; set; } = string.Empty;
    }
}
