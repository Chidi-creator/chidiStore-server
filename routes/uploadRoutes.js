const path = require('path')
const express = require('express')
const multer = require('multer')


const router = express.Router()

router.post('/', (req, res) =>{
    res.send("hello")
})


module.exports = router