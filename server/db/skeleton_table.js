class skeletonTable {
  constructor() {
    super(db, 'wallets');
  }

  async create({ service, xpubs, minimum, settlementAddress }, trx) {
    const result = await this.createQuery(trx)
      .returning('id')
      .insert({ service, xpubs, minimum, settlementAddress });
    return this.find(result[0], trx);
  }

  async update(id, settlementAddress, trx) {
    return this.createQuery(trx)
      .where({ id })
      .update({ settlementAddress });
  }

  async find(id, trx) {
    return this.createQuery(trx).where({ id }).first();
  }

  async findByXpubs(service, xpubs, trx) {
    return this.createQuery(trx).where({ service, xpubs }).first();
  }

  async findBySettlementAddress(service, settlementAddress, trx) {
    return this.createQuery(trx).where({ service, settlementAddress }).first();
  }

  async findAll(trx) {
    return this.createQuery(trx);
  }

  async findAllByService(service, trx) {
    return this.createQuery(trx).where({ service });
  }
}

module.exports = skeletonTable;
