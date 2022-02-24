const mongo = require('mongoose');

const PerfilSchema = new mongo.Schema(
  {
    idStaff: [{ type: mongo.Schema.Types.ObjectId, ref: 'User' }],
    manager: Boolean,
    name: { type: mongo.Schema.Types.ObjectId, ref: 'User' },
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

export default mongo.model('Perfil', PerfilSchema);
