const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required:
        true,
        maxLength: 32,
        unique: true,
    }
})

module.exports = mongoose.model('Category', categorySchema)