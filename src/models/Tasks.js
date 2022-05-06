const mongo = require('mongoose');

const TasksSchema = new mongo.Schema(
  {
    data: Date,
    etiqueta: { type: mongo.Schema.Types.ObjectId, ref: 'Etiquetas' },
    fase: Number,
    prioridade: Number,
    subtarefa: [
      {
        id: String,
        title: String,
        status: String,
        user: { type: mongo.Schema.Types.ObjectId, ref: 'Perfil' },
        texto: String,
      },
    ],
    texto: String,
    users: [{ type: mongo.Schema.Types.ObjectId, ref: 'Perfil' }],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

module.exports = mongo.model('Tasks', TasksSchema);
