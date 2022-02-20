//metodos: index, show, update, store, destroy
/*
index: listagem de sessoes
store: Criar uma sessao
show: Quando queremos listar uma UNICA sessao
update: quando queremos alterar alguma sessao
destroy: quando queremos deletar uma sessao
*/

import Etiquetas from "../models/Etiquetas";
import User from "../models/User";

class EtiquetasController {
  async index(req, res) {
    let data = await Etiquetas.find();
    return res.json(data);
  }

  async show(req, res) {
    let data = await Etiquetas.findById(req.params.id);
    return res.json(data);
  }

  async store(req, res) {
    const { name } = req.body;
    const etiquetaBody = req.body;

    let etiqueta = await Etiquetas.findOne({ name });

    if (!etiqueta) {
      etiqueta = await Etiquetas.create(etiquetaBody);
    }
    return res.json("Etiqueta " + etiqueta.etiqueta + " Salva com sucesso");
  }

  async update(req, res) {
    const etiqueta = req.body;
    etiqueta = await Etiquetas.updateOne(etiqueta);
    return res.json(etiqueta.name + "Editada com sucesso");
  }

  async delete(req, res) {
    const { id } = req.params;
    etiqueta = await Etiquetas.deleteOne(id);
    return res.json("Deletado com sucesso");
  }
}

export default new EtiquetasController();
