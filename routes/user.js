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
router.route('/getMap').post((req,res) => {
    const query = {
        "isAdmin" : false
    }
    User.find(query)
        .then(info => {
            let map = new Map()
            for(var i=0; i<info.length; i++)
            {
                var cuser = info[i]
                if(map.has(cuser.team))
                {
                    map.get(cuser.team).push(cuser.name)
                }
                else
                {
                    map.set(cuser.team,[cuser.name])
                }
                console.log(map)
            }
            var ret = ""
            map.forEach((value, key) => {  
                ret+="Team "+key +": "+value+"\n" 
            });
            res.json(ret)

        })
})
router.route('/deleteAll').post((req,res) => {
    const query = {
        "isAdmin" : false
    }
    User.remove(query)
        .then(() => res.json("Done"))
        .catch(err => res.json(err))
})
router.route('/individualrank').post((req,res) => {
    const query = {
        "isAdmin":false
    }
    User.find(query).sort({iScore:-1})
        .then(info => {
            const ranks = info.map(person => {
                return [person.name,person.iScore!=-500?person.iScore:"0",person.team]
            })
            res.json(ranks)
        })
        .catch(err => res.json(err))
})
router.route('/findTeam').post((req,res) => {
    const team = req.body.team
    const query = {
        "team" : team
    }
    User.find(query)
        .then(info => res.json(info))
        .catch(err => res.json(err))
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
    const hasTakenWritten = false
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
        hasTakenWritten,
        timeStarted,
        iScore,
        iScoreinfo
    })

    newUser.save()
        .then(() => res.json("Added"))
        .catch(err => res.status(400).json("Error" + err))

})
module.exports = router