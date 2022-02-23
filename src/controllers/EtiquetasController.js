import * as Yup from 'yup';
import Etiquetas from '../models/Etiquetas';

class EtiquetasController {
  async index(req, res) {
    const data = await Etiquetas.find();
    return res.json(data);
  }

  async show(req, res) {
    const data = await Etiquetas.findById(req.id);
    return res.json(data);
  }

  async store(req, res) {
    const { etiqueta } = req.body;
    const etiquetaBody = req.body;
    const schema = Yup.object().shape({
      etiqueta: Yup.string().required(),
      color: Yup.string().required(),
      icon: Yup.number().required(),
    });

    let etiquetaCheck = await Etiquetas.findOne({ etiqueta });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    if (!etiquetaCheck) {
      etiquetaCheck = await Etiquetas.create(etiquetaBody);
    }
    return res.json(`Etiqueta ${etiquetaCheck.etiqueta} Salva com sucesso`);
  }

  async update(req, res) {
    const etiquetaBody = req.body;
    const schema = Yup.object().shape({
      etiqueta: Yup.string().min(3).required(),
      color: Yup.string().required(),
      icon: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const etiqueta = await Etiquetas.updateOne({ _id: req.id }, etiquetaBody);
    return res.json(etiqueta);
  }

  async destroy(req, res) {
    await Etiquetas.findByIdAndDelete({ _id: req.id });
    return res.json('Deletado com sucesso!');
  }
}

export default new EtiquetasController();
