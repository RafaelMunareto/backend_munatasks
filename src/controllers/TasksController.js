const Yup = require('yup');
const Tasks = require('../models/Tasks');

class TasksController {
  async index(req, res) {
    const data = await Tasks.find({ name: req.id }).populate([
      'etiqueta',
      {
        path: 'subtarefa.user',
        populate: {
          path: 'name',
        },
      },
      {
        path: 'users',
        populate: {
          path: 'name',
        },
      },
    ]);

    return res.json(data);
  }

  async show(req, res) {
    const data = await Tasks.findById(req.id).populate([
      'etiqueta',
      'users',
      'subtarefa.user',
    ]);

    return res.json(data);
  }

  async total(req, res) {
    const data = await Tasks.find({ name: req.id })
      .populate([
        'etiqueta',
        {
          path: 'subtarefa.user',
          populate: {
            path: 'name',
          },
        },
        {
          path: 'users',
          populate: {
            path: 'name',
          },
        },
      ])
      .lean();

    const data2 = data.reduce(
      (memory, res2) => [
        ...memory,
        ...res2.users.reduce(
          (memory2, user) => [...memory2, { ...user, tarefa: res2.texto }],
          []
        ),
      ],
      []
    );

    const cont_tarefas = [...new Set(data2.map((d) => d._id))].map((n) => ({
      id: n,
      name: data2.find((f) => f._id === n),
      qtd: data2.filter((f) => f._id === n).length,
      tarefa: data.filter((f) => f.users.some((u) => u._id === n)),
    }));

    return res.json(cont_tarefas);
  }

  async fase(req, res) {
    const data = await Tasks.find({ id: req.id })
      .find({ fase: req.params.fase })
      .populate([
        'etiqueta',
        {
          path: 'subtarefa.user',
          populate: {
            path: 'name',
          },
        },
        {
          path: 'users',
          populate: {
            path: 'name',
          },
        },
      ]);

    return res.json(data);
  }

  async store(req, res) {
    const { texto } = req.body;
    const data = req.body;

    const schema = Yup.object().shape({
      data: Yup.date().required(),
      etiqueta: Yup.string().required(),
      fase: Yup.number().required(),
      prioridade: Yup.number().required(),
      subTarefa: Yup.array().of(Yup.string().required()),
      texto: Yup.string().min(3).required(),
      users: Yup.array().required(),
    });

    let check = await Tasks.findOne({ texto });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    if (!check) {
      check = await Tasks.create(data);
    } else {
      return res
        .status(400)
        .json({ error: 'Texto da etiqueta já está na base.' });
    }
    return res.json(`Tarefa ${texto} Salva com sucesso`);
  }

  async update(req, res) {
    const data = req.body;
    const schema = Yup.object().shape({
      data: Yup.date().required(),
      etiqueta: Yup.string().required(),
      fase: Yup.number().required(),
      prioridade: Yup.number().required(),
      subTarefa: Yup.array().of(Yup.string().required()),
      texto: Yup.string().min(3).required(),
      users: Yup.array().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const task = await Tasks.updateOne({ _id: req.id }, data);
    return res.json(task);
  }

  async destroy(req, res) {
    await Tasks.findByIdAndDelete({ _id: req.id });
    return res.json('Deletado com sucesso!');
  }
}

module.exports = new TasksController();
