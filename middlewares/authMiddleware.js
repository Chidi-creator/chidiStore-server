const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const User = require("../models/userModel");

const authenticate = async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (err) {
      res.status(401).json({ message: "Not Authorised, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not Authorised, no token" });
  }
};

const authorizeAdmin = (req, res, next) =>{
    if (req.user && req.user.isAdmin )
    {next()}else{
        res.status(401).json({ message: "Not an authorised admin" });
    }
}

module.exports = {authenticate, authorizeAdmin}