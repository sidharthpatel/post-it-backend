// Multer is a node.js middleware for handling file uploads.
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

/**
 * Connecting to Amason S3 Bucket
 */
const s3 = new aws.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});

const upload = () =>
  multer({
    storage: multerS3({
      s3,
      bucket: "post-it-storage",
      metadata: (req, file, callback) => {
        callback(null, { fieldName: file.fieldname });
      },
      key: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(" ").join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + "-" + Date.now() + "." + ext);
      },
    }),
  });

module.exports = upload().single("image");
