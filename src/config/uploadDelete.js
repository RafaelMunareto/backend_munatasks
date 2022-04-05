const multer = require('multer');
const path = require('path');
const fs = require('fs');
module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const dest = path.resolve(__dirname, '..', '..', 'uploads') + name + ext;
      console.log(dest);
      if (fs.existsSync(dest)) {
        fs.unlink(dest);
      }
    },
  }),
};
