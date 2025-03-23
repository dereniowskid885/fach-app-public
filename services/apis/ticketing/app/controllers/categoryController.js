const Category = require('../models/Category');

const getOrCreateCategory = async (req, res) => {
  try {
    const categoryName = req.params.name.trim();

    let category = await Category.findOne({ name: categoryName });

    if (!category) {
      category = new Category({ name: categoryName });
      await category.save();
    }

    return res.status(200).json(category);
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during retrieval of category',
      error: err.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    let category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(400).json({ message: 'Category with provided id does not exist' });
    }

    return res.status(200).json(category);
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during retrieval of category',
      error: err.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    let categories = await Category.find();

    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during retrieval of categories',
      error: err.message,
    });
  }
};

const assignSpecialistToCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { userId } = req.body;

    let category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(400).json({ message: 'Category with provided id does not exist' });
    }

    category.specialists.push(userId);
    await category.save();

    return res.status(200).json({ message: 'Specialist assigned to category successfully' });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during category update',
      error: err.message,
    });
  }
};

const removeSpecialistFromCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { userId } = req.body;

    let category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(400).json({ message: 'Category with provided id does not exist' });
    }

    const indexToRemove = category.specialists.findIndex((id) => id.equals(userId));
    const userIdNotFound = indexToRemove === -1;

    if (userIdNotFound) {
      return res.status(400).json({ message: 'Specialist was not assigned to this category' });
    }

    // delete category if provided specialist was only one assigned
    if (category.specialists.length === 1) {
      const categoryName = category.name;
      await category.deleteOne();

      return res.status(200).json({ message: `Category ${categoryName} was removed because of lack of specialists` });
    }

    category.specialists.splice(indexToRemove, 1);
    await category.save();

    return res.status(200).json({ message: 'Specialist succesfully removed from category' });
  } catch (err) {
    return res.status(500).json({
      message: 'Server error during category update',
      error: err.message,
    });
  }
};

module.exports = {
  getOrCreateCategory,
  getCategories,
  assignSpecialistToCategory,
  removeSpecialistFromCategory,
  getCategoryById,
};
