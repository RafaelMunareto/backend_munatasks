const mongo = require('mongoose');

const NotificationsSchema = new mongo.Schema({
  user: String,
  texto: String,
});

module.exports = mongo.model('Notifications', NotificationsSchema);
