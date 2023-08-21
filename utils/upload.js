const multer = require('multer');
const path = require('path');

const uploadPath = path.join(process.cwd(), 'tmp'); //* check/validation folder

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
    fileSize: 1048576, // 1MB
    },
});
module.exports = upload;