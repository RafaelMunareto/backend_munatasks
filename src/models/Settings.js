import { Schema, model } from 'mongoose';

const SettingsSchema = new Schema(
  {
    color: [String],
    fase: [{ color: String, name: String, icon: Number, status: String }],
    order: [String],
    prioridade: [Number],
    retard: [{ tempoName: String, tempoValue: Number }],
    subtarefaInsert: [String],
    version: Number,
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

export default model('Settings', SettingsSchema);
