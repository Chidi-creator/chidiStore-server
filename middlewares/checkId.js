const {isValidObjectId} = require('mongoose')

const checkId = (req, res, next) =>{
if(!isValidObjectId(req.params.id)){
        res.status(404)
        throw new Error(`Invalid object of: ${req.params.id}`)
}
next()
}

module.exports = checkId