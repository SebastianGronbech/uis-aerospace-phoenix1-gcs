using Gui.Core.Domain.Tenants;
using Gui.Core.Exceptions;
using Shouldly;

namespace tests.Core.Domain.Tenants;

public class TenantTests
{
    [Fact]
    public void CreateTenant_ValidArguments_CreatesTenant()
    {
        // Arrange
        var id = Guid.NewGuid();
        var name = "Test Tenant";

        // Act
        var tenant = new Tenant(id, name);

        // Assert
        tenant.Id.ShouldBe(id);
        tenant.Name.ShouldBe(name);
    }

    [Fact]
    public void CreateTenant_EmptyId_ThrowsArgumentException()
    {
        // Arrange
        var id = Guid.Empty;
        var name = "Test Tenant";

        // Act
        Action action = () => new Tenant(id, name);

        // Assert
        action.ShouldThrow<ArgumentException>();
    }

    [Fact]
    public void CreateTenant_EmptyName_ThrowsArgumentException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var name = "";

        // Act
        Action action = () => new Tenant(id, name);

        // Assert
        action.ShouldThrow<ArgumentException>();
    }

    [Fact]
    public void AddNewUser_AddsOneUser()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");
        var userId = Guid.NewGuid();

        // Act
        tenant.AddUser(userId);

        // Assert
        tenant.Users.Count().ShouldBe(1);
        tenant.Users.ShouldAllBe(u => u.Id == userId);
    }

    [Fact]
    public void AddSameUserTwice_ThrowsInvalidOperationException()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");
        var userId = Guid.NewGuid();

        // Act
        tenant.AddUser(userId);
        Action action = () => tenant.AddUser(userId);

        // Assert
        action.ShouldThrow<InvalidOperationException>();
    }

    [Fact]
    public void AddUserWithEmptyId_ThrowsArgumentException()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");

        // Act
        Action action = () => tenant.AddUser(Guid.Empty);

        // Assert
        action.ShouldThrow<ArgumentException>();
    }

    [Fact]
    public void SetUserToAdmin_UserIsSpectator_SetsUserToAdmin()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");
        tenant.AddUser(Guid.NewGuid());
        var User = tenant.Users.First();

        // Act
        tenant.SetUserToAdmin(User.Id);

        // Assert
        User.Role.ShouldBe(UserRole.Admin);
    }

    [Fact]
    public void SetUserToAdmin_UserIsAlreadyAdmin_DoesNotChangeRole()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");
        tenant.AddUser(Guid.NewGuid());
        var User = tenant.Users.First();
        tenant.SetUserToAdmin(User.Id);

        // Act
        tenant.SetUserToAdmin(User.Id);

        // Assert
        User.Role.ShouldBe(UserRole.Admin);
    }


    [Fact]
    public void SetUserToAdmin_UserNotFound_ThrowsEntityNotFoundException()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");

        // Act
        Action action = () => tenant.SetUserToAdmin(Guid.NewGuid());

        // Assert
        action.ShouldThrow<EntityNotFoundException>();
    }
}