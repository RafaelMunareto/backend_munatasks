import { Schema, model } from 'mongoose';

const EtiquetaSchema = new Schema({
  etiqueta: String,
  color: String,
  icon: Number
});

export default model('Etiquetas', EtiquetaSchema);