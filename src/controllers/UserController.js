import * as Yup from 'yup';
import bcrypt from 'bcryptjs/dist/bcrypt';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const data = await User.find().populate('name');
    return res.json(data);
  }

  async show(req, res) {
    const data = await User.findById(req.id);
    return res.json(data);
  }

  async store(req, res) {
    const { email, name, password } = req.body;
    const schema = Yup.object().shape({
      name: Yup.string().min(3).required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

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

  async destroy(req, res) {
    await User.findByIdAndDelete({ _id: req.id });
    return res.json('Deletado com sucesso!');
  }
}

export default new UserController();
