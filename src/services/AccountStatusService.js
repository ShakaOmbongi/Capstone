const AccountStatusRepository = require('../repositories/AccountStatusRepository');

// Service for account statuses
class AccountStatusService {
  // Create a new account status
  async createAccountStatus(statusData) {
    return await AccountStatusRepository.createAccountStatus(statusData);
  }

  // Get an account status by ID (throws error if not found)
  async getAccountStatusById(statusId) {
    const status = await AccountStatusRepository.getAccountStatusById(statusId);
    if (!status) throw new Error('Account status not found');
    return status;
  }

  // Get all account statuses
  async getAllAccountStatuses() {
    return await AccountStatusRepository.getAllAccountStatuses();
  }

  // Update an account status by ID (throws error if not found)
  async updateAccountStatus(statusId, updates) {
    const status = await AccountStatusRepository.updateAccountStatus(statusId, updates);
    if (!status) throw new Error('Account status not found');
    return status;
  }

  // Delete an account status by ID (throws error if not found)
  async deleteAccountStatus(statusId) {
    const status = await AccountStatusRepository.deleteAccountStatus(statusId);
    if (!status) throw new Error('Account status not found');
    return status;
  }
}

module.exports = new AccountStatusService();
