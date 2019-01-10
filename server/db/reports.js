const Reports = require('../models/reports_schema');

class dbReports {
  async findAllByDate() {
    return Reports.find().sort({ startDate: -1 });
  }

  async findOne(query) {
    return Reports.findOne(query);
  }

  async findAll() {
    return Reports.find();
  }

  async find(query) {
    return Reports.find(query).sort({ startDate: -1 });
  }

  async delete(query) {
    return Reports.remove(query);
  }

  async updateById(_id, newValue) {
    const newReports = { $set: newValue };
    try {
      const updated = await Reports.updateOne({ _id }, newReports);
      return updated;
    } catch (err) {
      throw err;
    }
  }

  async insert(newNews) {
    return Reports.create(newNews);
  }
}

module.exports = dbReports;
