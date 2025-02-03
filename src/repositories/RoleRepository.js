const Role = require('../entities/Role');

class RoleRepository {
  /**
   * Creates a new role.
   * @param {Object} roleData - Data for the new role.
   * @returns {Promise<Object>} The created role.
   */
  async createRole(roleData) {
    return await Role.create(roleData);
  }

  /**
   * Retrieves a role by its primary key.
   * @param {number} roleId - The role ID.
   * @returns {Promise<Object|null>} The role, or null if not found.
   */
  async getRoleById(roleId) {
    return await Role.findByPk(roleId);
  }

  /**
   * Retrieves all roles.
   * @returns {Promise<Array>} A list of roles.
   */
  async getAllRoles() {
    return await Role.findAll();
  }

  /**
   * Updates a role.
   * @param {number} roleId - The role ID.
   * @param {Object} updates - The updates to apply.
   * @returns {Promise<number[]>} The result of the update operation.
   */
  async updateRole(roleId, updates) {
    const result = await Role.update(updates, { where: { id: roleId } });
    return result;
  }

  /**
   * Deletes a role.
   * @param {number} roleId - The role ID.
   * @returns {Promise<number>} The number of rows deleted.
   */
  async deleteRole(roleId) {
    return await Role.destroy({ where: { id: roleId } });
  }
}

module.exports = new RoleRepository();
