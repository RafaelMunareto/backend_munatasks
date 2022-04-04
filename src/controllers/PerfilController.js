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
    const { filename } = req.file;
    const { idStaff, name, nameTime, manager } = req.body;
    const schema = Yup.object().shape({
      // idStaff: Yup.array().required(),
      name: Yup.string().min(3).required(),
      nameTime: Yup.string().min(3).required(),
      manager: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const perfil = await Perfil.create({
      urlImage: filename,
      idStaff,
      name,
      nameTime,
      manager,
    });

    return res.json(perfil);
  }

  async update(req, res) {
    const { filename } = req.file ?? '';
    const { idStaff, name, nameTime, manager } = req.body;
    const perfil = await Perfil.findById(req.id);
    if (req.file != '') {
      await perfil.updateOne({
        urlImage: filename,
      });
    } else {
      await perfil.updateOne({
        idStaff,
        name,
        nameTime,
        manager,
      });
    }

    return res.json(perfil);
  }

  async destroy(req, res) {
    await Perfil.findByIdAndDelete({ _id: req.id });
    return res.json('Deletado com sucesso!');
  }
}

module.exports = new PerfilController();
