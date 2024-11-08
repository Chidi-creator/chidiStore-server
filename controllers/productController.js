const Product = require("../models/productModel");

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;
    // validation

    switch (true) {
      case !name:
        return res.json({ message: "Name is required" });
      case !brand:
        return res.json({ message: "Brand is required" });
      case !description:
        return res.json({ message: "Description is required" });
      case !price:
        return res.json({ message: "Price is required" });
      case !category:
        return res.json({ message: "Category is required" });
      case !quantity:
        return res.json({ message: "Quantity is required" });
    }
    const product = new Product({ ...req.fields });
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const updateProductDetails = async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;
    // validation

    switch (true) {
      case !name:
        return res.json({ message: "Name is required" });
      case !brand:
        return res.json({ message: "Brand is required" });
      case !description:
        return res.json({ message: "Description is required" });
      case !price:
        return res.json({ message: "Price is required" });
      case !category:
        return res.json({ message: "Category is required" });
      case !quantity:
        return res.json({ message: "Quantity is required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "internal server error" });
  }
};

const removeProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const fetchProducts = async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const fetchProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
      res.json(products)
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const addProductReview = async (req, res) =>{
try {
  const {rating, comment} = req.body
  const product = await Product.findById(req.params.id)

  if(product){
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

    if(alreadyReviewed) return res.status(400).json({message: "Product already reviewed"})

  const review ={
    name: req.user.username,
    rating: Number(rating),
    comment,
    user:req.user._id
  }
  product.reviews.push(review)
  product.numReviews = product.reviews.length

  let totalRating = 0

  product.reviews.forEach((review) => {
    totalRating += review.rating;
  });
  
  product.rating = totalRating / product.reviews.length;
  
  await product.save()
  res.status(201).json({message: "Review Added"})

  }else{
    res.status(404).json({message: "Product not found"})
  }
  
} catch (error) {
  res.status(500).json({messae: error.message})
}
}

const fetchTopProducts = async (req, res) =>{
  try{

    const products = await Product.find({}).sort({rating: -1}).limit(4)
    res.json(products)



  }catch(err){
    res.staus(500).json({message: err.message})
  }
}

const fetchNewProducts = async (req, res) =>{
  try {
    const products = await Product.find({}).sort({_id: -1}).limit(5)
    res.json(products)
    
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}
module.exports = {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts
};
