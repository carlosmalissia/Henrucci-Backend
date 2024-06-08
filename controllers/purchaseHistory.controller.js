import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import PurchaseHistory from "../models/purchaseHistory.model.js";

const create = async (req, res) => {
  try {
    const purchaseHistory = new PurchaseHistory(req.body);
    await purchaseHistory.save();
    const user = await User.findById(req.body.user);
    user.purchaseHistory.push(purchaseHistory._id);
    user.save();
    return res
      .status(200)
      .json({ message: "Purchase History successfuly created!" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
const list = async (req, res) => {
  try {
    let purchaseHistory = await PurchaseHistory.find({ isDeleted: false })
      .select("user product created")
      .populate({
        path: "user",
        select: "name lastname email",
      })
      .populate({
        path: "product",
        select: "title category precio",
        populate: { path: "category", select: "name" },
      });
    res.status(200).json(purchaseHistory);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const listPerUser = async (req, res) => {
  const user = req.profile;
  try {
    const list = await PurchaseHistory.find({ user: user._id }).populate({
      path: "user",
      select: "name lastname email",
    });
    res.status(200).json(list);
  } catch (error) {
    res.status(400).json({
      message: "can't find any purchase history with that user ID",
      error,
    });
  }
};

const purchaseHistoryByID = async (req, res, next, id) => {
  try {
    let purchaseHistory = await PurchaseHistory.findById(id);
    if (!purchaseHistory) {
      return res.status(400).json({
        error: "Purchase history not found",
      });
    }
    req.purchaseHistory = purchaseHistory;
    next();
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

const read = (req, res) => {
  return res.json(req.purchaseHistory);
};

const update = async (req, res) => {
  try {
    let purchaseHistory = req.purchaseHistory;
    req.body = { ...req.body, updated: Date.now() };
    await PurchaseHistory.findByIdAndUpdate(
      purchaseHistory._id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ message: "The purchase history has been updated!" });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};
const remove = async (req, res) => {
  try {
    let purchaseHistory = req.purchaseHistory;
    if (req.body.type == "soft") {
      await PurchaseHistory.findByIdAndUpdate(
        purchaseHistory._id,
        { isDeleted: true },
        { new: true }
      );
      res.status(200).json({
        message: `The purchase history ${purchaseHistory._id} has been SoftDeleted!`,
      });
    } else {
      await PurchaseHistory.findByIdAndDelete(purchaseHistory._id);
      res.status(200).json({
        message: `The purchase history ${purchaseHistory._id} has been Deleted!`,
      });
    }
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

export default {
  create,
  purchaseHistoryByID,
  read,
  list,
  remove,
  update,
  listPerUser,
};
