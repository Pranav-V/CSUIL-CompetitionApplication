const router = require("express").Router()
let Admin = require("../models/admin.model")

router.route('/adminSettings').post((req,res) => {
    Admin.find()
        .then(info => res.json(info))
        .catch(err => res.status(400).json("Error" + err))
})

router.route('/addAdminSettings').post((req,res) => {

    const newAdmin = new Admin({
        "MCtestEnabled": false
    })
    
    newAdmin.save()
        .then(() => res.json("Added"))
        .catch(err => res.status(400).json("Error" + err))
})

module.exports = router