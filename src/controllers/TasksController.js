const Yup = require('yup');
const Perfil = require('../models/Perfil');
const Tasks = require('../models/Tasks');
const mailConfig = require('../config/mail');
const mailController = require('../mail/MailController');
const Notifications = require('../models/Notifications');

class TasksController {
  async index(req, res) {
    var perfil = await Perfil.findById(req.id);
    if (perfil.idStaff == null) {
      perfil.idStaff = [req.id];
    } else {
      perfil.idStaff = await perfil.idStaff.push(req.id);
    }

    const data = await Tasks.find({
      users: { $in: perfil.idStaff },
    }).populate([
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
    const data = await Tasks.find()
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
        ...res2.users.reduce((memory2, user) => [...memory2, { ...user }], []),
      ],
      []
    );

    const cont_tarefas = [...new Set(data2.map((d) => d._id))]
      .map((n) => ({
        id: n,
        name: data2.find((f) => f._id === n),
        qtd: data2.filter((f) => f._id === n).length,
        tarefa: data.filter((f) => f.users.some((u) => u._id === n)),
      }))
      .sort((a, b) => (a.qtd < b.qtd ? 1 : -1));

    return res.json(cont_tarefas);
  }

  async fase(req, res) {
    var perfil = await Perfil.findById(req.id);
    if (perfil == null) {
      return res.json('Perfil não encontrado!');
    }
    if (perfil.idStaff == null) {
      perfil.idStaff = [req.id];
    } else {
      perfil.idStaff = perfil.idStaff.push(req.id);
    }
    const task = await Tasks.find({ users: { $in: perfil.idStaff } })
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

    return res.json(task);
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
      Tasks.create(data, (err, data) => {
        if (err) {
          return res.status(500).send({ err });
        }
        return res.status(200).json(data);
      });
    } else {
      return res
        .status(400)
        .json({ error: 'Texto da etiqueta já está na base.' });
    }
  }

  async update(req, res) {
    const data = req.body;
    const schema = Yup.object().shape({
      data: Yup.date().required(),
      etiqueta: Yup.string().required(),
      fase: Yup.number().required(),
      prioridade: Yup.number().required(),
      texto: Yup.string().min(3).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const task = await Tasks.findById(req.id);
    await task.updateOne(data);
    return res.json(task);
  }

  async destroy(req, res) {
    await Tasks.findByIdAndDelete({ _id: req.id });
    return res.json('Deletado com sucesso!');
  }

  async sendNewTarefa(req, res) {
    const idTask = req.params.id;
    const task = await Tasks.findById(idTask).populate([
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
    if (task == null) {
      return res.json('Nenhuma tarefa encontrada');
    } else {
      for (var i = 0; i < task.users.length; i++) {
        Notifications.create({
          user: task.users[i].id,
          texto: task.texto,
        });
        mailConfig.enviarEmail(
          'MunaTasks',
          task.users[i].name.email,
          'Nova Tarefa criada',
          mailController.notificacao(task.texto)
        );
      }
      return res.json('Email enviado com sucesso!');
    }
  }

  async notifications(req, res) {
    const data = await Notifications.find({
      user: req.id,
    }).populate('user');

    return res.json(data);
  }

  async notificationsDelete(req, res) {
    await Notifications.find({ user: req.id }).remove();
    return res.json('Deletado com sucesso!');
  }
}

module.exports = new TasksController();
