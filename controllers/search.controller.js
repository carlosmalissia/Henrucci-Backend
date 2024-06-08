import Product from "../models/product.model.js";

const search = async (req, res, next) => {
  const { searchValue } = req.params;
  const regex = new RegExp(searchValue, "i");
  try {
    const products = await Product.find({ title: { $regex: regex } })
    .populate({
      path: "category",
      select: "name",
  });
    //return res.status(200).json(products);
    req.products = products;
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export default { search };
