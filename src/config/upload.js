const multer = require('multer');
const path = require('path');
const fs = require('fs');
module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const id = file.originalname.split('-')[0];
      const extension = 'png';
      const nameDelete = path.basename(name , ext);
      if (name == 'person.png') {
        const dest = path.resolve(
          __dirname,
          '..',
          '..',
          'uploads',
          `${name}${ext}`
        );
        cb(null, `${req.id}-${Date.now()}${ext}`);
      } else {
        const dest = path.resolve(
          __dirname,
          '..',
          '..',
          'uploads',
          `${nameDelete}.${extension}`
        );
        if (fs.existsSync(dest)) {
          fs.unlinkSync(dest);
        }
        cb(null, `${id}-${Date.now()}${ext}`);
      }
    },
  }),
};

