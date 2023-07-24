const multer = require("multer");
const apiError = require("../utils/apiError");

const multerOptionImage = (fileDest) => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new apiError("Images only supported", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

exports.uploadSingleImage = (fileName) => multerOptionImage().single(fileName);
