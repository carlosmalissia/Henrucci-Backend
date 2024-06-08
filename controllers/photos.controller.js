import Photos from "../models/photos.model.js";

const create = async (req, res) => {
  if (req.file.buffer.length > 0) {
    const photo = new Photos({
      name: req.file.originalname,
      photoData: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });
    try {
      await photo.save();
      res.set("Content-Type", req.file.mimetype);
      res.setHeader("Content-Security-Policy", "img-src 'self' data:;");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      return res
        .status(200)
        .json({ message: "Photo successfuly created!", id: photo._id });
    } catch (err) {
      return res.status(500).send({ error: err });
    }
  } else {
    return res
      .status(400)
      .send({ error: "Not a valid photo format or empty file" });
  }
};

const list = async (req, res) => {
  try {
    const photos = await Photos.find({ isDeleted: false }).select("_id");
    res.setHeader("Content-Security-Policy", "img-src 'self' data:;");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.status(200).json(photos);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const photoById = async (req, res, next, id) => {
  try {
    const photo = await Photos.findById(id);
    req.photo = photo;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Could not retreive Photo" });
  }
};

const read = (req, res) => {
  res.set("Content-Type", req.photo.photoData.contentType);
  res.setHeader("Content-Security-Policy", "img-src 'self' data:;");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  return res.send(req.photo.photoData.data);
};

const update = async (req, res) => {
  const photo = req.photo;
  try {
    await Photos.findByIdAndUpdate(photo._id, { $set: req.body });
    res.setHeader("Content-Security-Policy", "img-src 'self' data:;");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.status(200).json({ message: "Photo updated!" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  const photo = req.photo;
  try {
    if (req.body.type == "soft") {
      await Photos.findByIdAndUpdate(photo._id, {
        $set: { isDeleted: true },
      });
      res.status(200).json({ message: "Photo SoftDeleted!" });
    } else {
      await Photos.findByIdAndDelete(photo._id);
      res.status(200).json({ message: "Photo deleted!" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export default { create, list, photoById, update, remove, read };
