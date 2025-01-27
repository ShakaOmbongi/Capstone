const Role = require('../entities/Role');

class RoleRepository {
  async createRole(roleData) {
    return await Role.create(roleData);
  }

  async getRoleById(roleId) {
    return await Role.findByPk(roleId);
  }

  async getAllRoles() {
    return await Role.findAll();
  }

  async updateRole(roleId, updates) {
    return await Role.update(updates, { where: { id: roleId } });
  }

  async deleteRole(roleId) {
    return await Role.destroy({ where: { id: roleId } });
  }
}

module.exports = new RoleRepository();
