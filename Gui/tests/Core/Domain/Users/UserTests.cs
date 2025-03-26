using Gui.Core.Domain.Users;
using Shouldly;

namespace tests.Core.Domain.Users;

public class UserTests
{
    [Fact]
    public void CreateUser_ValidArguments_CreatesUser()
    {
        // Arrange
        var id = Guid.NewGuid();
        var name = "Test User";

        // Act
        var user = User.Create(id, name);

        // Assert
        user.Id.ShouldBe(id);
        user.Name.ShouldBe(name);
    }

    [Fact]
    public void CreateUser_EmptyId_ThrowsArgumentException()
    {
        // Arrange
        var id = Guid.Empty;
        var name = "Test User";

        // Act
        Action action = () => User.Create(id, name);

        // Assert
        action.ShouldThrow<ArgumentException>();
    }

    [Fact]
    public void CreateUser_EmptyName_ThrowsArgumentException()
    {
        // Arrange
        var id = Guid.NewGuid();
        var name = "";

        // Act
        Action action = () => User.Create(id, name);

        // Assert
        action.ShouldThrow<ArgumentException>();
    }

    [Fact]
    public void AssignRole_AddsOneRole()
    {
        // Arrange
        var user = User.Create(Guid.NewGuid(), "Test User");
        var unitId = Guid.NewGuid();
        var role = UserRole.Admin;

        // Act
        user.AssignRole(unitId, role);

        // Assert
        user.Roles.Count.ShouldBe(1);
    }

    [Fact]
    public void AssignRole_AddsCorrectRole()
    {
        // Arrange
        var user = User.Create(Guid.NewGuid(), "Test User");
        var unitId = Guid.NewGuid();
        var role = UserRole.Admin;

        // Act
        user.AssignRole(unitId, role);

        // Assert
        user.Roles.ShouldAllBe(u => u.UnitId == unitId && u.Role == role);
    }

    [Fact]
    public void AssignRole_ExistingRole_DoesNotUpdateRole()
    {
        // Arrange
        var user = User.Create(Guid.NewGuid(), "Test User");
        var unitId = Guid.NewGuid();
        var role = UserRole.Admin;
        user.AssignRole(unitId, role);

        // Act
        user.AssignRole(unitId, role);

        // Assert
        user.Roles.First().Role.ShouldBe(UserRole.Admin);
    }

    [Fact]
    public void AssignRole_DuplicateRole_DoesNotAddRole()
    {
        // Arrange
        var user = User.Create(Guid.NewGuid(), "Test User");
        var unitId = Guid.NewGuid();
        var role = UserRole.Admin;

        // Act
        user.AssignRole(unitId, role);
        user.AssignRole(unitId, role);

        // Assert
        user.Roles.Count.ShouldBe(1);
    }

    [Fact]
    public void UpdateRole_ExistingRole_UpdatesRole()
    {
        // Arrange
        var user = User.Create(Guid.NewGuid(), "Test User");
        var unitId = Guid.NewGuid();
        var role = UserRole.Admin;
        user.AssignRole(unitId, role);

        // Act
        user.UpdateRole(unitId, UserRole.Spectator);

        // Assert
        user.Roles.First().Role.ShouldBe(UserRole.Spectator);
    }

    [Fact]
    public void UpdateRole_NonExistingRole_ThrowsInvalidOperationException()
    {
        // Arrange
        var user = User.Create(Guid.NewGuid(), "Test User");
        var unitId = Guid.NewGuid();

        // Act
        Action action = () => user.UpdateRole(unitId, UserRole.Admin);

        // Assert
        action.ShouldThrow<InvalidOperationException>();
    }

}