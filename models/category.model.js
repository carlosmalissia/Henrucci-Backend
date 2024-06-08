import mongoose, { mongo } from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: "Category already exists",
        required: "Name is required",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
});

export default mongoose.model("Category", CategorySchema);