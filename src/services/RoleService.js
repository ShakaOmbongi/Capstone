const RoleRepository = require('../repositories/RoleRepository');

// Service for role management
class RoleService {
  // Create a new role
  async createRole(roleData) {
    return await RoleRepository.createRole(roleData);
  }

  // Get role by ID; throw error if not found
  async getRoleById(roleId) {
    const role = await RoleRepository.getRoleById(roleId);
    if (!role) throw new Error('Role not found');
    return role;
  }

  // Get all roles
  async getAllRoles() {
    return await RoleRepository.getAllRoles();
  }

  // Update role by ID; throw error if not found
  async updateRole(roleId, updates) {
    const role = await RoleRepository.updateRole(roleId, updates);
    if (!role) throw new Error('Role not found');
    return role;
  }

  // Delete role by ID; throw error if not found
  async deleteRole(roleId) {
    const role = await RoleRepository.deleteRole(roleId);
    if (!role) throw new Error('Role not found');
    return role;
  }
}

module.exports = new RoleService();
