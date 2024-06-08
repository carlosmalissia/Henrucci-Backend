import mongoose, { mongo } from "mongoose";

const PhotosSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: "photo already exists",
    required: "Name is required",
  },
  photoData: {
    data: Buffer,
    contentType: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Photo", PhotosSchema);
