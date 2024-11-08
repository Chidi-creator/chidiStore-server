const express = require("express");
const router = express.Router();
const formidable = require('express-formidable')
//controllers
const {addProduct, updateProductDetails, removeProduct, fetchProducts, fetchProductById, fetchAllProducts, addProductReview, fetchTopProducts, fetchNewProducts} = require('../controllers/productController')

const {authenticate, authorizeAdmin} = require('../middlewares/authMiddleware')
const checkId = require('../middlewares/checkId')

router.route('/')
        .get(fetchProducts)
        .post(authenticate, authorizeAdmin, formidable(),addProduct)

router.route('/allproducts')
                .get(fetchAllProducts)

router.route('/:id/reviews')
        .post(authenticate,authorizeAdmin, checkId, addProductReview)

router.route('/top')
        .get(fetchTopProducts)

router.route('/new')
        .get(fetchNewProducts)

        router.route('/:id')
                .get(fetchProductById)
                .put(authenticate, authorizeAdmin, formidable(), updateProductDetails)
                .delete(authenticate, authorizeAdmin, removeProduct)



module.exports = router;
