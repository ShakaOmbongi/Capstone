const AccountStatus = require('../entities/AccountStatus');

// Repository for account statuses
class AccountStatusRepository {
  // Create a new status
  async createAccountStatus(statusData) {
    return await AccountStatus.create(statusData);
  }

  // Get a status by ID
  async getAccountStatusById(statusId) {
    return await AccountStatus.findByPk(statusId);
  }

  // Get all statuses
  async getAllAccountStatuses() {
    return await AccountStatus.findAll();
  }

  // Update a status by ID
  async updateAccountStatus(statusId, updates) {
    return await AccountStatus.update(updates, { where: { id: statusId } });
  }

  // Delete a status by ID
  async deleteAccountStatus(statusId) {
    return await AccountStatus.destroy({ where: { id: statusId } });
  }
}

module.exports = new AccountStatusRepository();
