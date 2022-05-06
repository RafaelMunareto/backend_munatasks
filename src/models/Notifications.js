const mongo = require('mongoose');

const NotificationsSchema = new mongo.Schema({
  id: String,
  user: { type: mongo.Schema.Types.ObjectId, ref: 'Perfil' },
  texto: String,
});

module.exports = mongo.model('Notifications', NotificationsSchema);
