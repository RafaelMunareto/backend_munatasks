import { Schema, model } from 'mongoose';

const PerfilSchema = new Schema({
  idStaff: Array,
  manager: Boolean,
  name: String,
  nameTime: String,
  urlImage: String,
}, {
    toJSON: {
      virtuals: true
    }
  });
  
  PerfilSchema.virtual('PerfilUrlImage').get(function(){
    return `http://localhost:3333/files/${this.urlImage}`;
  })
  
export default model('Perfil', PerfilSchema);