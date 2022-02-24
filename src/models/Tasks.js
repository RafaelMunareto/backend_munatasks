import { Schema, model } from 'mongoose';

const TasksSchema = new Schema(
  {
    data: Date,
    etiqueta: { type: Schema.Types.ObjectId, ref: 'Etiquetas' },
    fase: Number,
    prioridade: Number,
    subtarefa: [
      {
        title: String,
        status: String,
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        texto: String,
      },
    ],
    texto: String,
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

export default model('Tasks', TasksSchema);
