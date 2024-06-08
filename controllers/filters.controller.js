import Product from "../models/product.model.js";

const filter = async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  const { price, category, rating, minprice, maxprice } = req.query;
  //console.log(price, rating, category);
  if (!price && !category && !rating) return next(); //it doesn't filters applied then go to paginate
  try {
    let productsfiltered = [];
    if (price) {
      if (!price === "asc" || !price === "des" || !price === "range")
        throw new Error("option of filter by price is not valid");
      if (price === "range") {
        if (productsfiltered.length == 0) {
          productsfiltered = await Product.find({
            price: { $gte: Number(minprice), $lte: Number(maxprice) },
          })
            .populate({
              path: "category",
              select: "name",
            })
            .populate({
              path: "reviews",
              select: "user rating comment",
              populate: { path: "user", select: "name lastname email" },
            })
            .sort({ price: 1 });
        } else {
          productsfiltered = productsfiltered.filter((product) => {
            product.price >= Number(minprice) ||
              product.price <= Number(maxprice);
          });
          //order ascendent
          productsfiltered = productsfiltered.sort((a, b) => {
            if (a.price > b.price) {
              return 1;
            } else if (a.price < b.price) {
              return -1;
            }
            return 0;
          });
        }
      } else if (productsfiltered.length == 0) {
        //first filter: get products from the db
        productsfiltered = await Product.find({ isDeleted: false })
          .populate({
            path: "category",
            select: "name",
          })
          .populate({
            path: "reviews",
            select: "user rating comment",
            populate: { path: "user", select: "name lastname email" },
          })
          .sort({ price: price === "asc" ? 1 : -1 });
        //console.log("BD", productsfiltered);
      } else {
        //comes filtered previously
        productsfiltered = productsfiltered.sort((a, b) => {
          if (a.price > b.price) {
            return price === "des" ? -1 : 1;
          } else if (a.price < b.price) {
            return price === "asc" ? -1 : 1;
          }
          return 0;
        });
      }
    }
    if (rating) {
      if (!rating === "asc" || !rating === "des")
        throw new Error("option of filter by rating is not valid");
      if (productsfiltered.length == 0) {
        //first filter: get products from the db
        productsfiltered = await Product.find({ isDeleted: false })
          .populate({
            path: "category",
            select: "name",
          })
          .populate({
            path: "reviews",
            select: "user rating comment",
            populate: { path: "user", select: "name lastname email" },
          });
      }
      //comes filtered previously
      productsfiltered = productsfiltered.sort((a, b) => {
        let ratingA = a.averageRating;
        let ratingB = b.averageRating;
        if (!a.averageRating) {
          ratingA = 0;
        }
        if (!b.averageRating) {
          ratingB = 0;
        }
        if (ratingA > ratingB) {
          return rating === "des" ? -1 : 1;
        }
        if (ratingA < ratingB) {
          return rating === "asc" ? -1 : 1;
        }
        return 0;
      });
    }
    if (category) {
      if (productsfiltered.length == 0) {
        //first filter: get products from the db
        productsfiltered = await Product.find({ isDeleted: false })
          .populate({
            path: "category",
            select: "name",
          })
          .populate({
            path: "reviews",
            select: "user rating comment",
            populate: { path: "user", select: "name lastname email" },
          });
      }
      //comes filtered previously
      productsfiltered = productsfiltered.filter(
        (product) => product.category.name == category
      );
    }
    req.products = productsfiltered;
    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export default { filter };
