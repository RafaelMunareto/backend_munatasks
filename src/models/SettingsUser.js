const mongo = require('mongoose');

const SettingsUserSchema = new mongo.Schema(
  {
    user: String,
    emailInicial: String,
    emailFinal: String,
    mobile: String
  },

);

module.exports = mongo.model('SettingsUser', SettingsUserSchema);
