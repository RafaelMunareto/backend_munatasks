const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authConfig = require('../config/auth');

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Usuario não existe.' });
    }

    if (!(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret),
    });
  }
}

module.exports = SessionController();
