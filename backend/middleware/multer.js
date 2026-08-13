import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

const productUpload = upload.fields([
  {
    name: "image1",
    maxCount: 1,
  },
  {
    name: "image2",
    maxCount: 1,
  },
  {
    name: "image3",
    maxCount: 1,
  },
  {
    name: "image4",
    maxCount: 1,
  },
]);

export default productUpload;