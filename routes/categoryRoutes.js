const express = require("express");
const router = express.Router();
const {
  authenticate,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");
const { createCategory, updateCategory, removeCategory, listCategories, readCategory } = require("../controllers/categoryController");

router.route("/")
      .post(authenticate, authorizeAdmin, createCategory)
  
      

router.route('/:categoryId')
      .put(authenticate, authorizeAdmin, updateCategory)       
      .delete(authenticate, authorizeAdmin, removeCategory)


router.route('/categories')      
       .get(listCategories)

router.route('/:id')
       .get(readCategory)

module.exports = router;
