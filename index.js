require("dotenv").config();
const path = require("path");
const fs = require('fs')
const cors = require('cors')
const express = require("express");
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/userRoutes')
const tokenRoutes = require('./routes/getInfoFromTokenRoutes')
const corsOptions = require('./config/corsOptions')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const uploadRoutes = require('./routes/uploadRoutes')

const connectDB = require("./config/db");
connectDB();

// ensuring the uploads dir exists
const uplooadDir = path.join(__dirname, '/uploads')
if (!fs.existsSync(uplooadDir)){
  fs.mkdirSync(uplooadDir)
}



const app = express();
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/user-info', tokenRoutes)
app.use('/api/products', productRoutes)
app.use('/api/upload', uploadRoutes)


app.use('/uploads', express.static(path.join(__dirname + '/uploads')))

app.listen(process.env.PORT, () => {
  console.log(`server listening on port: ${process.env.PORT}`);
});
