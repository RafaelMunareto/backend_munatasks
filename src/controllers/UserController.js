const Yup = require('yup');
const bcrypt = require('bcryptjs/dist/bcrypt');
const User = require('../models/User');
const mailConfig = require('../config/mail');

class UserController {
  async index(req, res) {
    const data = await User.find({}, ['name', 'email', 'id']);

    return res.json(data);
  }

  async showEmail(req, res) {
    const user = await User.findOne({ email: req.id });
    res.status(200).json(user);
  }

  async show(req, res) {
    const user = await User.findById(req.id);
    res.json(user);
  }

  async store(req, res) {
    const { email, name, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists !== null) {
      return res.status(400).json({ error: 'Usuario já existe.' });
    }

    const user = await User.create({
      email,
      name,
      password,
    });

    return res.json(user);
  }

  async updateUserName(req, res) {
    const { name } = req.body;
    const schema = Yup.object().shape({
      name: Yup.string().min(3).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const user = await User.findById(req.id);

    await await user.updateOne({
      name,
    });

    return res.json(user);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    req.body.password = await bcrypt.hash(req.body.password, 8);
    const { email, oldPassword } = req.body;

    const user = await User.findById(req.id);

    if (email !== user.email) {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ error: 'Usuario já existe.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async updatePassword(req, res) {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    const user = await User.findById(req.params.id);
    await user.updateOne({ password: req.body.password });
    return res.json('Senha alterada com sucesso');
  }

  async destroy(req, res) {
    await User.findByIdAndDelete({ _id: req.id });
    return res.json('Deletado com sucesso!');
  }

  async sendChangePasswordmail(req, res) {
    const email = req.params.email;
    const user = await User.find({ email: email });
    if (user.length == 0) {
      return res.json('Email não encontrado.');
    } else {
      await mailConfig.enviarEmail(
        'MunaTasks',
        email,
        'Alteração de senha Munatasks',
        MailController.forgetSenha(user[0].id)
      );

      return res.json('Email enviado com sucesso!');
    }
  }

}

module.exports = new UserController();
