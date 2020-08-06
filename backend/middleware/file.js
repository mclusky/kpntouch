const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const jimp = require('jimp');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        if (file.mimetype.startsWith('image/') && MIME_TYPE_MAP[file.mimetype]) {
            next(null, true);
        } else {
            next({ message: 'Filetype not allowed!' }, false);
        }
    }
};

const sortFile = multer({ multerOptions }).single("image");

const resize = async (req, res, next) => {
    // check if there's a new file
    if (!req.file) {
        next();
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.image = `${uuidv4()}.${extension}`;
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./backend/images/${req.body.image}`);
    next();
};

module.exports = { sortFile, resize }