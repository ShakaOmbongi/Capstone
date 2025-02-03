const AccountStatusRepository = require('../repositories/AccountStatusRepository');

class AccountStatusService {
  async createAccountStatus(statusData) {
    return await AccountStatusRepository.createAccountStatus(statusData);
  }

  async getAccountStatusById(statusId) {
    const status = await AccountStatusRepository.getAccountStatusById(statusId);
    if (!status) throw new Error('Account status not found');
    return status;
  }

  async getAllAccountStatuses() {
    return await AccountStatusRepository.getAllAccountStatuses();
  }

  async updateAccountStatus(statusId, updates) {
    const status = await AccountStatusRepository.updateAccountStatus(statusId, updates);
    if (!status) throw new Error('Account status not found');
    return status;
  }

  async deleteAccountStatus(statusId) {
    const status = await AccountStatusRepository.deleteAccountStatus(statusId);
    if (!status) throw new Error('Account status not found');
    return status;
  }
}

module.exports = new AccountStatusService();
