

import User from '../models/User';

class UserController{
  
  async index(req, res) {
    let data = await User.find();
    return res.json(data);
  }

  async show(req, res) {
    let data = await User.findById(req.id);
    return res.json(data);
  }

  async store(req, res){

    const { filename } = req.file;
    const { email, name, verificado } = req.body;

    const user = await User.create({
      urlImage: filename,
      email,
      name,
      verificado,
    });

    return res.json(user);
  
  }

  async update(req, res) {
    const { filename } = req.file;
    const { email, name, verificado } = req.body;

    const user = await User.findById(req.id);
    await user.update({
      urlImage: filename,
      email,
      name,
      verificado,
    });

    return res.json(user);
  }

  async destroy(req, res) {
    let user = await User.findById(req.id);
    
    if(user){
      user.delete();
      return res.json(user.name + " deletada com sucesso!");
    }else{
      res.json({erro : "Erro ao deletar a etiqueta!"})
    }
  }

}

export default new UserController();