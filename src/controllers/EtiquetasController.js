import Etiquetas from "../models/Etiquetas";

class EtiquetasController {
  async index(req, res) {
    let data = await Etiquetas.find();
    return res.json(data);
  }

  async show(req, res) {
    let data = await Etiquetas.findById(req.id);
    return res.json(data);
  }

  async store(req, res) {
    const { etiqueta } = req.body;
    const etiquetaBody = req.body;

    let etiquetaCheck = await Etiquetas.findOne({ etiqueta });

    if (!etiquetaCheck) {
      etiquetaCheck = await Etiquetas.create(etiquetaBody);
    }
    return res.json("Etiqueta " + etiquetaCheck.etiqueta + " Salva com sucesso");
  }

  async update(req, res) {
    const etiquetaBody = req.body;
    let etiqueta = await Etiquetas.findById(req.id);
    etiqueta.update(etiquetaBody);
    return res.json(etiqueta.etiqueta + " editada com sucesso");
  }

  async destroy(req, res) {
    let etiqueta = await Etiquetas.findById(req.id);

    if(etiqueta){
      etiqueta.delete();
      return res.json(etiqueta.etiqueta + " deletada com sucesso!");
    }else{
      res.json({erro : "Erro ao deletar a etiqueta!"})
    }
  }
}

export default new EtiquetasController();
