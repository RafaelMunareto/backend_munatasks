const multer = require('multer');
const path = require('path');
const fs = require('fs');
module.exports = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
      if (
        fs.existsSync(
          path.resolve(__dirname, '..', '..', 'uploads') + name + '-' + ext
        )
      ) {
        fs.unlink(
          path.resolve(__dirname, '..', '..', 'uploads') + name + '-' + ext
        );
      }

      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);

      cb(null, `${name}-${ext}`);
    },
  }),
};
