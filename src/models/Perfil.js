import { Schema, model } from 'mongoose';

const PerfilSchema = new Schema(
  {
    idStaff: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    manager: Boolean,
    name: { type: Schema.Types.ObjectId, ref: 'User' },
    nameTime: String,
    urlImage: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

PerfilSchema.virtual('PerfilUrlImage').get(function () {
  return `http://localhost:3333/files/${this.urlImage}`;
});

export default model('Perfil', PerfilSchema);
