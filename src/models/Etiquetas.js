const mongo = require('mongoose');

const EtiquetaSchema = new mongo.Schema({
  etiqueta: String,
  color: String,
  icon: Number,
});

export default mongo.model('Etiquetas', EtiquetaSchema);
