const mongo = require('mongoose');

const PerfilSchema = new mongo.Schema({
  idStaff: [{ type: mongo.Schema.Types.ObjectId, ref: 'Perfil' }],
  manager: Boolean,
  name: { type: mongo.Schema.Types.ObjectId, ref: 'User' },
  nameTime: String,
  urlImage: String,
});

module.exports = mongo.model('Perfil', PerfilSchema);
