const RoleRepository = require('repositories/RoleRepository');

class RoleService {
  async createRole(roleData) {
    return await RoleRepository.createRole(roleData);
  }

  async getRoleById(roleId) {
    const role = await RoleRepository.getRoleById(roleId);
    if (!role) throw new Error('Role not found');
    return role;
  }

  async getAllRoles() {
    return await RoleRepository.getAllRoles();
  }

  async updateRole(roleId, updates) {
    const role = await RoleRepository.updateRole(roleId, updates);
    if (!role) throw new Error('Role not found');
    return role;
  }

  async deleteRole(roleId) {
    const role = await RoleRepository.deleteRole(roleId);
    if (!role) throw new Error('Role not found');
    return role;
  }
}

module.exports = new RoleService();
