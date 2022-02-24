const mongo = require('mongoose');

const TasksSchema = new mongo.Schema(
  {
    data: Date,
    etiqueta: { type: mongo.Schema.Types.ObjectId, ref: 'Etiquetas' },
    fase: Number,
    prioridade: Number,
    subtarefa: [
      {
        title: String,
        status: String,
        user: { type: mongo.Schema.Types.ObjectId, ref: 'User' },
        texto: String,
      },
    ],
    texto: String,
    users: [{ type: mongo.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

export default mongo.model('Tasks', TasksSchema);
