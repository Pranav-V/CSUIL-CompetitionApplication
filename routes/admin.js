const router = require("express").Router()
let Admin = require("../models/admin.model")

router.route('/adminSettings').post((req,res) => {
    Admin.find()
        .then(info => res.json(info))
        .catch(err => res.status(400).json("Error" + err))
})

router.route('/updateCount/').post((req,res) => {
    Admin.find()
        .then(info => {
            info[0].currentTeamCount +=1
            info[0].save()
                .then(() => res.json("updated"))
                .catch(err => res.json(err))
        })
        .catch(err => res.json(err))
})
router.route('/clearCount/').post((req,res) => {
    Admin.find()
        .then(info => {
            info[0].currentTeamCount =0
            info[0].save()
                .then(() => res.json("updated"))
                .catch(err => res.json(err))
        })
        .catch(err => res.json(err))
})
router.route('/updateMC/').post((req,res) => {
    Admin.find()
        .then(info => {
            info[0].MCtestEnabled = !info[0].MCtestEnabled
            info[0].save()
                .then(() => res.json("updated"))
                .catch(err => res.json(err))
        })
        .catch(err => res.json(err))
})
router.route('/updateFR/').post((req,res) => {
    Admin.find()
        .then(info => {
            info[0].WrittentestEnabled = !info[0].WrittentestEnabled
            info[0].save()
                .then(() => res.json("updated"))
                .catch(err => res.json(err))
        })
        .catch(err => res.json(err))
})

router.route('/addAdminSettings').post((req,res) => {

    const newAdmin = new Admin({
        "MCtestEnabled": false, 
        "WrittentestEnabled":false,
        "currentTeamCount":0
})
    
    newAdmin.save()
        .then(() => res.json("Added"))
        .catch(err => res.status(400).json("Error" + err))
})

module.exports = router