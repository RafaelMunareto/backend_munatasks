const Yup = require('yup');
const Perfil = require('../models/Perfil');
const Tasks = require('../models/Tasks');
const mailConfig = require('../config/mail');
const mailController = require('../mail/MailController');
const Notifications = require('../models/Notifications');
const io = require('../app').io;

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

  async tasksFilterUser(req, res) {
    var perfil = await Perfil.findById(req.id);
    
    const data = await Tasks.find({
      users: perfil.id,
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
    const tasks = await Tasks.find()
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

    const allUsers = await Perfil.find().populate('name').populate('idStaff').lean();
    return res.json(
      allUsers.map(user => {
        const filteredTasks = tasks.filter(task => task.users.some(u => u._id.equals(user._id))).filter((b) => b.fase < 2)
        return {
        id: user._id,
        name: user,
        qtd: filteredTasks.length,
        tarefa: filteredTasks
      }})
    )

  }

  async fase(req, res) {
    var perfis = await Perfil.find();
    var perfil = perfis.find(perfil => perfil.id == req.id);
    if (perfil == null) {
      return res.json('Perfil não encontrado!');
    }
    if (perfil.idStaff == null) {
      perfil.idStaff = [req.id];
    } else {
      perfil.idStaff = perfil.idStaff.push(req.id);
    }
    const ids = [...new Set(
        [
          ...perfil.idStaff, 
          ...perfil.idStaff.map(id => 
              perfis
                .filter(perfil => perfil.id == id)
                .map(perfil => perfil.idStaff) 
              )
        ].flat()
    )]

    const task = await Tasks.find({ users: { $in: ids } })
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
        if (req.params.tipo == '1') {
          mailConfig.enviarEmail(
            'MunaTasks',
            task.users[i].name.email,
            'Tarefa finalizada!',
            mailController.notificacao(task.texto, req.params.tipo)
          );
        } else {
          mailConfig.enviarEmail(
            'MunaTasks',
            task.users[i].name.email,
            'Nova Tarefa criada',
            mailController.notificacao(task.texto, req.params.tipo)
          );
          io.emit('new_task', task);
        }
      }
      return res.json('Email enviado com sucesso!');
    }
  }

  async notifications(req, res) {
    const data = await Notifications.find({
      user: req.id,
    });
    if (data == null) {
      return res.json();
    }

    return res.json(data);
  }

  async notificationsDelete(req, res) {
    await Notifications.find({ user: req.id }).deleteOne();
    return res.json('Deletado com sucesso!');
  }
}

module.exports = new TasksController();
