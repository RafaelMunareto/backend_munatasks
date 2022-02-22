

import User from '../models/User';
import * as Yup from 'yup';
class UserController{

  async index(req, res) {
    let data = await User.find().populate('name');
    return res.json(data);
  }

  async show(req, res) {
    let data = await User.findById(req.id);
    return res.json(data);
  }

  async store(req, res){

    const { filename } = req.file;
    const { email, name, verificado } = req.body;
    const schema = Yup.object().shape({
      name: Yup.string().min(3).required(),
      email: Yup.string().email().required(),
      verificado: Yup.boolean().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const user = await User.create({
      urlImage: filename,
      email,
      name,
      verificado,
    });

    return res.json(user);

  }

  async update(req, res) {
    const { filename } = req.file;
    const { email, name, verificado } = req.body;
    const schema = Yup.object().shape({
      name: Yup.string().min(3).required(),
      email: Yup.string().email().required(),
      verificado: Yup.boolean().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Falha na validação.' });
    }
    const user = await User.updateOne({ _id: req.id }, {
      urlImage: filename,
      email,
      name,
      verificado,
    });

    return res.json(user);
  }

  async destroy(req, res) {
    await User.findByIdAndDelete({_id: req.id});
    return res.json("Deletado com sucesso!");
  }

}

export default new UserController();
