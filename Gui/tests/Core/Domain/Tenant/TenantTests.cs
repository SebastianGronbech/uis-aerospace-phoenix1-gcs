using Shouldly;

namespace Core.Domain.Tenant;

public class TenantTests
{
    [Fact]
    public void AddNewUser_AddsOneUser()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");

        // Act
        tenant.AddTenantUser(Guid.NewGuid());

        // Assert
        tenant.TenantUsers.Count().ShouldBe(1);
    }
}