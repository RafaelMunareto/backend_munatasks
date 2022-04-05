const multer = require('multer');
const path = require('path');
const fs = require('fs');
module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const id = name.split('-')[0];
      const nameDelete = path.basename(name.split('.')[0], ext);
      const dest = path.resolve(
        __dirname,
        '..',
        '..',
        'uploads',
        `${nameDelete}${ext}`
      );
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
      }
      cb(null, `${id}-${Date.now()}${ext}`);
    },
  }),
};
