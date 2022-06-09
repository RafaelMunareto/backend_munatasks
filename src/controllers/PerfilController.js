const Yup = require('yup');
const Perfil = require('../models/Perfil');
const SettingsUser = require('../models/SettingsUser');

class PerfilController {
  async index(req, res) {
    const data = await Perfil.find().populate([
      'name',
      {
        path: 'idStaff',
        populate: {
          path: 'name',
        },
      },
    ]);

    const dataSort = data.sort((a, b) => a.name.name.localeCompare(b.name.name));
    return res.json(dataSort);
  }

  async show(req, res) {
    const data = await Perfil.findById(req.id)
      .populate('name')
      .populate('idStaff');
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
    const { filename } = req.body.file ?? 'person.png';
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
    const id = req.id
    let urlImage;

    if (req.file) {
      urlImage = req.file.filename
    }

    const { idStaff, name, nameTime, manager } = req.body;

    if (req.body) {
      const schema = Yup.object().shape({
        name: Yup.string().min(3),
        nameTime: Yup.string().min(3),
        manager: Yup.boolean(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação.' });
      }

    }

    const perfil = await Perfil.findById(req.id);

    const updateValue = { urlImage, name, nameTime, manager, idStaff }
    const sanitizedUpdateValue = Object.fromEntries(Object.entries(updateValue).filter(([_, v]) => v != null))


    await perfil.updateOne(sanitizedUpdateValue);

    return res.json(perfil);
  }

  async destroy(req, res) {
    await Perfil.findByIdAndDelete({ _id: req.id });
    return res.json('Deletado com sucesso!');
  }

  async settingsUser(req, res) {
    const data = await SettingsUser.find({ user: req.id })
    if (data != null) {
      return res.json(data);
    } else {
      return res.json('0');
    }

  }

  async settingsUserUpdate(req, res) {
    const settings = await SettingsUser.find({ user: req.id });
    const data = req.body;
    if (settings != null) {
      const settingsId = await SettingsUser.findById(settings[0].id);
      await settingsId.updateOne(data);
    }

    return res.json(data);
  }

  async settingsUserStore(req, res) {
    const settings = await SettingsUser.create(req.body);
    return res.json(req.body);
  }
}

module.exports = new PerfilController();
