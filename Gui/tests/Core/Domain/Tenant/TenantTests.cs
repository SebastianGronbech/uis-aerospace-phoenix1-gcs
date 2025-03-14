using Shouldly;

namespace Core.Domain.Tenant;

public class TenantTests
{
    [Fact]
    public void AddNewUser_AddsOneUser()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");
        var tenantUser = new TenantUser(Guid.NewGuid());

        // Act
        tenant.AddTenantUser(tenantUser);

        // Assert
        tenant.TenantUsers.Count().ShouldBe(1);
    }

    [Fact]
    public void AddSameUserTwice_AddsOneUser()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");
        var tenantUser = new TenantUser(Guid.NewGuid());

        // Act
        tenant.AddTenantUser(tenantUser);
        tenant.AddTenantUser(tenantUser);

        // Assert
        tenant.TenantUsers.Count().ShouldBe(1);
    }

    [Fact]
    public void AddNullUser_ThrowsArgumentNullException()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");

        // Act
        Action action = () => tenant.AddTenantUser(null!);

        // Assert
        action.ShouldThrow<ArgumentNullException>();
    }
}