const mongo = require('mongoose');

const SettingsSchema = new mongo.Schema(
  {
    color: [String],
    fase: [{ color: String, name: String, icon: Number, status: String }],
    order: [String],
    prioridade: [Number],
    retard: [{ tempoName: String, tempoValue: Number }],
    subtarefaInsert: [String],
    version: [String],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

module.exports = mongo.model('Settings', SettingsSchema);
