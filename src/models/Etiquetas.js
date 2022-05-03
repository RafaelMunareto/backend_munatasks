const mongo = require('mongoose');

const EtiquetaSchema = new mongo.Schema({
  id: String,
  etiqueta: String,
  color: String,
  icon: Number,
});

module.exports = mongo.model('Etiquetas', EtiquetaSchema);
