import mongoose, { mongo } from "mongoose";
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: "Title is required",
    },
    price: {
      type: Number,
      required: "Price is required",
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: "Image is required",
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    stock: {
      type: Number,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    updated: Date,
  },
  opts
);

ProductSchema.virtual("averageRating").get(function () {
  const ratings = this.reviews.map((review) => review.rating);
  const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  return average;
});

export default mongoose.model("Product", ProductSchema);
