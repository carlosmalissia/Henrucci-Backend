import Category from "../models/category.model.js";

const create = async (req, res) => {
  const { name } = req.body;
  try {
    const exists = await Category.exists({ name });
    if (exists) {
      throw new Error("Category already exists");
    } else {
      await Category.create({ name });
      return res.status(200).json({ message: "Category successfuly created!" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const list = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false });
    res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const categoryById = async (req, res, next, id) => {
  try {
    const category = await Category.findById(id);
    req.category = category;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Could not retreive category" });
  }
};

const read = (req, res) => {
  return res.json(req.category);
};

const update = async (req, res) => {
  const category = req.category;
  try {
    const exists = await Category.exists({ name: req.body.name });
    if (exists) {
      throw new Error("Category alredy exists");
    }
    await Category.findByIdAndUpdate(category._id, { $set: req.body });
    res.status(200).json({ message: "Category updated!" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  const category = req.category;
  try {
    if (req.body.type == "soft") {
      await Category.findByIdAndUpdate(category._id, {
        $set: { isDeleted: true },
      });
      res.status(200).json({ message: "Category SoftDeleted!" });
    } else {
      await Category.findByIdAndDelete(category._id);
      res.status(200).json({ message: "Category deleted!" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export default { create, list, categoryById, update, remove, read };
