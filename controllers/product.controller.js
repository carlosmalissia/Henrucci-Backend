import Product from "../models/product.model.js";

const create = async (req, res) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    stock: req.body.stock,
  });
  try {
    await product.save();
    return res.status(200).json({ message: "Product successfuly created!" });
  } catch (err) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
const list = async (req, res) => {
  try {
    console.log("🚀 ~ list ~ req.headers.origin:", req.headers.origin);
    let products =
      req.headers.origin == "https://admindashboard.up.railway.app" ||
      "http://localhost:3000"
        ? await Product.find()
            .populate({
              path: "category",
              select: "name",
            })
            .populate({
              path: "reviews",
              select: "user rating comment isDeleted",
              populate: { path: "user", select: "name lastname email" },
            })
        : await Product.find({ isDeleted: false })
            .populate({
              path: "category",
              select: "name",
            })
            .populate({
              path: "reviews",
              match: { isDeleted: false },
              select: "user rating comment isDeleted",
              populate: { path: "user", select: "name lastname email" },
            });
    res.setHeader("Content-Security-Policy", "img-src 'self' data:;");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.json(products);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
const productByID = async (req, res, next, id) => {
  try {
    let product = await Product.findById(id).populate({
      path: "category",
      select: "name",
    });
    if (!product) {
      return res.status(400).json({
        error: "Product not found",
      });
    }
    req.product = product;
    next();
  } catch (error) {
    return res.status(400).json({
      error: "Could not retreive product",
    });
  }
};

const read = async (req, res) => {
  try {
    await req.product.populate({
      path: "reviews",
      select: "user rating comment created isDeleted",
      populate: { path: "user", select: "name lastname email" },
    });
    return res.json(req.product);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  console.log("🚀 ~ update ~ req:", req.body);
  try {
    let product = req.product;
    req.body = { ...req.body, updated: Date.now() };
    await Product.findByIdAndUpdate(
      product._id,
      { $set: req.body },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};
const remove = async (req, res) => {
  try {
    let product = req.product;
    if (req.body.type == "soft") {
      await Product.findByIdAndUpdate(
        product._id,
        { isDeleted: true },
        { new: true }
      );
      res
        .status(200)
        .json({ message: `Product ${product._id} has been SoftDeleted!` });
    } else {
      await Product.findByIdAndDelete(product._id);
      res
        .status(200)
        .json({ message: `Product ${product._id} has been Deleted!` });
    }
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    res.setHeader("Content-Security-Policy", "img-src 'self' data:;");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    return res.send(req.product.photo.data);
  }
  next();
};

const top = async (req, res) => {
  const { end } = req.params;
  try {
    const products = await Product.find({ isDeleted: false })
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "reviews",
        select: "user rating comment",
        populate: { path: "user", select: "name lastname email" },
      });
    const top = products.sort((a, b) => {
      let ratingA = a.averageRating;
      let ratingB = b.averageRating;
      if (!a.averageRating) {
        ratingA = 0;
      }
      if (!b.averageRating) {
        ratingB = 0;
      }
      if (ratingA > ratingB) {
        return -1;
      }
      if (ratingA < ratingB) {
        return 1;
      }
      return 0;
    });
    res.setHeader("Content-Security-Policy", "img-src 'self' data:;");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.status(200).json(top.slice(0, end));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default { create, productByID, read, list, remove, update, photo, top };
