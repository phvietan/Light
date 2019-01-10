const News = require('../models/news_schema');

class dbNews {
  async findAllByDate() {
    return News.find().sort({ startDate: -1 });
  }

  async findOne(query) {
    return News.findOne(query);
  }

  async delete(query) {
    return News.remove(query);
  }

  async updateById(_id, newValue) {
    const newNews = { $set: newValue };
    try {
      const updated = await News.updateOne({ _id }, newNews);
      return updated;
    } catch (err) {
      throw err;
    }
  }

  async insert(newNews) {
    return News.create(newNews);
  }
}

module.exports = dbNews;
