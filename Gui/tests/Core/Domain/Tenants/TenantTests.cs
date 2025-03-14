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
        var userEmail = new Email("johnDoe@example.com");
        var User = new User("Test User", userEmail);

        // Act
        tenant.AddUser(User);

        // Assert
        tenant.Users.Count().ShouldBe(1);
    }

    [Fact]
    public void AddSameUserTwice_AddsOneUser()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");
        var userEmail = new Email("johnDoe@example.com");
        var User = new User("Test User", userEmail);

        // Act
        tenant.AddUser(User);
        tenant.AddUser(User);

        // Assert
        tenant.Users.Count().ShouldBe(1);
    }

    [Fact]
    public void AddNullUser_ThrowsArgumentNullException()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");

        // Act
        Action action = () => tenant.AddUser(null!);

        // Assert
        action.ShouldThrow<ArgumentNullException>();
    }

    [Fact]
    public void SetUserToAdmin_SetsUserToAdmin()
    {
        // Arrange
        var tenant = new Tenant(Guid.NewGuid(), "Test Tenant");
        var userEmail = new Email("johnDoe@example.com");
        var User = new User("Test User", userEmail);

        // Act
        tenant.AddUser(User);
        tenant.SetUserToAdmin(User);

        // Assert
        User.Role.ShouldBe(UserRole.Admin);
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