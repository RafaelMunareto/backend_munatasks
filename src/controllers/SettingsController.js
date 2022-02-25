const Settings = require('../models/Settings');

class SettingsController {
  async index(req, res) {
    const data = await Settings.find();
    return res.json(data);
  }

  async show(req, res) {
    const data = await Settings.findById(req.id);
    return res.json(data);
  }

  async store(req, res) {
    const data = req.body;
    await Settings.create(req.body);
    return res.json(data);
  }

  async update(req, res) {
    const data = req.body;
    const result = await Settings.updateOne({ _id: req.id }, data);
    return res.json(result);
  }

  async destroy(req, res) {
    await Settings.findByIdAndDelete({ _id: req.id });
    return res.json('Deletado com sucesso!');
  }
}

module.exports = SettingsController();
