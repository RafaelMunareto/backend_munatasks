const mongo = require('mongoose');

const SettingsUserSchema = new mongo.Schema(
  {
    user: String,
    emailInicial: Boolean,
    emailFinal: Boolean,
    mobile: Boolean,
    theme: Boolean
  },

);

module.exports = mongo.model('SettingsUser', SettingsUserSchema);
