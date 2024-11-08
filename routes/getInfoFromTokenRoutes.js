const express = require('express')
const router = express.Router()
const {getInfoFromToken} = require('../middlewares/getInfoFromToken')


router.route('/')
        .get(getInfoFromToken)

    

        module.exports = router
    