const { json } = require("express");
const Category = require("../models/categoryModel");

const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) return res.status(400).json({ message: "Name is required" });

    const existingCategory = await Category.findOne({ name });

    if (existingCategory)
      return res.status(409).json({ mesage: "Category Already Exists" });

    const category = await Category.create({ name });
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId });

    if (!category)
      return res.status(400).json({ message: "mumu Category not found" });

    category.name = name;

    const updatedCategory = await category.save();

    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const removeCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const removed = await Category.findByIdAndDelete(categoryId);
    res.json(removed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};
const listCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const readCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ _id: id });

    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  removeCategory,
  listCategories,
  readCategory,
};
