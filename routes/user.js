const router = require('express').Router()
let User = require('../models/user.model')

router.route('/authenticate').post((req,res) => {
    const username = req.body.username
    const password = req.body.password

    const query = {
        "username":username, 
        "password":password
    }
    
    User.find(query)
        .then(info => {
            let len = info.length
            len!=0?res.json(["Authorized", info]):res.json(["Rejected", info])
        })
        .catch(err => res.status(400).json("Error" + err))
})
router.route('/findTeam').post((req,res) => {
    const team = req.body.team
    const query = {
        "team" : team
    }
    User.find(query)
        .then(info => res.json(info))
        .catch(err => res.json(info))
})
router.route('/updateMCstatus/:id').post((req,res) => {
    User.findById(req.params.id)
        .then(user => {
            user.hasTakenMC = true
            user.save()
                .then(() => res.json("saved"))
                .catch(err => res.status(400).json("Error: "+err))
        })
        .catch(err => res.status(400).json("Error: "+ err))
})
router.route('/updateTime/:id').post((req,res) => {
    User.findById(req.params.id)
        .then(user => {
            const now = new Date()
            user.timeStarted = now
            user.save()
                .then(() => res.json(now))
                .catch(err => res.status(400).json("Error: "+err))
        })
        .catch(err => res.status(400).json("Error: "+ err))
})
router.route('/addMCScore/:id').post((req,res) => {
    User.findById(req.params.id)
        .then(user => {
            user.iScore = req.body.iScore
            user.iScoreinfo = req.body.iScoreinfo

            user.save()
                .then(()=>res.json("Saved"))
                .catch(err => res.status(400).json("Error: "+err))
        })
        .catch(err => res.status(400).json('Error: ' + err))
})
router.route('/adduser').post((req,res) => {
    const username = req.body.username
    const password = req.body.password
    const team = req.body.team
    const name = req.body.name
    const isAdmin = req.body.isAdmin
    const hasTakenMC = false
    const timeStarted = new Date(0)
    const iScore = -500
    const iScoreinfo = ""

    const newUser = new User({
        username,
        password, 
        team, 
        name, 
        isAdmin,
        hasTakenMC,
        timeStarted,
        iScore,
        iScoreinfo
    })

    newUser.save()
        .then(() => res.json("Added"))
        .catch(err => res.status(400).json("Error" + err))

})
module.exports = router