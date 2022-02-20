import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  id: String,
  email: String,
  name: String,
  urlImage: String,
  verificado: Boolean
});

export default model('User', UserSchema);