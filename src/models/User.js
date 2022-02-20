import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  email: String,
  name: String,
  urlImage: String,
  verificado: Boolean
}, {
  toJSON: {
    virtuals: true
  }
});

UserSchema.virtual('UserUrlImage').get(function(){
  return `http://localhost:3333/files/${this.urlImage}`;
})
export default model('User', UserSchema);