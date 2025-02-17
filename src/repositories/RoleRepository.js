const Role = require('../entities/Role');

class RoleRepository {
  // Create a new role
  async createRole(roleData) {
    return await Role.create(roleData);
  }

  // Get a role by ID
  async getRoleById(roleId) {
    return await Role.findByPk(roleId);
  }

  // Get all roles
  async getAllRoles() {
    return await Role.findAll();
  }

  // Update a role by ID
  async updateRole(roleId, updates) {
    return await Role.update(updates, { where: { id: roleId } });
  }

  // Delete a role by ID
  async deleteRole(roleId) {
    return await Role.destroy({ where: { id: roleId } });
  }
}

module.exports = new RoleRepository();
