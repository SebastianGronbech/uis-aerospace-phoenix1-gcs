using Core.Domain.Tenants;
using Shouldly;

namespace tests.Core.Domain.Tenants;

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

    [Fact]
    public void SetUserToAdmin_SetsUserToAdmin()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");
        var tenantUser = new TenantUser(Guid.NewGuid());

        // Act
        tenant.AddTenantUser(tenantUser);
        tenant.SetUserToAdmin(tenantUser);

        // Assert
        tenantUser.Role.ShouldBe(TenantUserRole.Admin);
    }

    [Fact]
    public void SetUserToAdmin_NullUser_ThrowsArgumentNullException()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");

        // Act
        Action action = () => tenant.SetUserToAdmin(null!);

        // Assert
        action.ShouldThrow<ArgumentNullException>();
    }
}