const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


const getInfoFromToken = async (req, res, next) =>{

    const {authorization} = req.headers
  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    next();

    res.status(200).json(user)
    
  }else{
    res.status(401).json({message:"Token requires, unathorized user"})
  }

}


module.exports = {getInfoFromToken}