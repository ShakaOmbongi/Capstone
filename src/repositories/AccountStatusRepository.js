const AccountStatus = require('../entities/AccountStatus');

class AccountStatusRepository {
  async createAccountStatus(statusData) {
    return await AccountStatus.create(statusData);
  }

  async getAccountStatusById(statusId) {
    return await AccountStatus.findByPk(statusId);
  }

  async getAllAccountStatuses() {
    return await AccountStatus.findAll();
  }

  async updateAccountStatus(statusId, updates) {
    return await AccountStatus.update(updates, { where: { id: statusId } });
  }

  async deleteAccountStatus(statusId) {
    return await AccountStatus.destroy({ where: { id: statusId } });
  }
}

module.exports = new AccountStatusRepository();
