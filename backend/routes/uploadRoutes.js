import express from "express";
import { upload } from "../utils/uploader.js";

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  res.send({
    image: `/${req.file.path}`,
    message: "התמונה הועלתה בהצלחה",
  });
});

export default router;
