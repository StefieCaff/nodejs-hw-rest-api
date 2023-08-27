const multer = require('multer');
const path = require('path');

const tmpDir = path.join(__dirname, "../", "tmps");
console.log(tmpDir);

const multerConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tmpDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: multerConfig,
    limits: {
        fileSize: 1048576 // 1Mb
    }
});

module.exports = upload;