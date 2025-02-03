const AccountStatus = require('../entities/AccountStatus');

class AccountStatusRepository {
  /**
   * Creates a new account status.
   * @param {Object} statusData - Data for the new account status.
   * @returns {Promise<Object>} The created account status.
   */
  async createAccountStatus(statusData) {
    return await AccountStatus.create(statusData);
  }

  /**
   * Retrieves an account status by its primary key.
   * @param {number} statusId - The account status ID.
   * @returns {Promise<Object|null>} The account status, or null if not found.
   */
  async getAccountStatusById(statusId) {
    return await AccountStatus.findByPk(statusId);
  }

  /**
   * Retrieves all account statuses.
   * @returns {Promise<Array>} A list of account statuses.
   */
  async getAllAccountStatuses() {
    return await AccountStatus.findAll();
  }

  /**
   * Updates an account status.
   * @param {number} statusId - The account status ID.
   * @param {Object} updates - The updates to apply.
   * @returns {Promise<number[]>} The result of the update operation.
   */
  async updateAccountStatus(statusId, updates) {
    // This returns an array: [affectedCount]
    const result = await AccountStatus.update(updates, { where: { id: statusId } });
    return result;
  }

  /**
   * Deletes an account status.
   * @param {number} statusId - The account status ID.
   * @returns {Promise<number>} The number of rows deleted.
   */
  async deleteAccountStatus(statusId) {
    return await AccountStatus.destroy({ where: { id: statusId } });
  }
}

module.exports = new AccountStatusRepository();
