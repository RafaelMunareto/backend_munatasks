const Yup = require('yup');
const Perfil = require('../models/Perfil');

class PerfilController {
  async index(req, res) {
    const data = await Perfil.find().populate('name').populate('idStaff');
    return res.json(data);
  }

  async show(req, res) {
    const data = await Perfil.find(req.id).populate('name').populate('idStaff');
    return res.json(data);
  }

  async showUser(req, res) {
    const data = await Perfil.find({ name: req.id }).populate([
      'name',
      {
        path: 'idStaff',
        populate: {
          path: 'name',
        },
      },
    ]);

    return res.json(data);
  }

  async store(req, res) {
    const { filename } = req.file ?? 'person.png';
    const { idStaff, name, nameTime, manager } = req.body;

    const userExists = await Perfil.findOne({ name: name });

    if (userExists !== null) {
      return res.status(400).json({ error: 'Perfil já existe.' });
    }

    var perfil = await Perfil.create({
      urlImage: filename == undefined ? 'person.png' : filename,
      idStaff,
      name,
      nameTime,
      manager,
    });

    return res.json(perfil);
  }

  async update(req, res) {
    const { filename } = req.file ?? 'person.png';
    const { idStaff, name, nameTime, manager } = req.body;
    const perfil = await Perfil.findById(req.id);

    console.log(filename);
    await perfil.updateOne({
      urlImage: filename == undefined ? 'person.png' : filename,
      idStaff,
      name,
      nameTime,
      manager,
    });

    return res.json(perfil);
  }

  async destroy(req, res) {
    await Perfil.findByIdAndDelete({ _id: req.id });
    return res.json('Deletado com sucesso!');
  }
}

module.exports = new PerfilController();
