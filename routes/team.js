const router = require("express").Router()
let Team = require("../models/team.model")

router.route('/createteam').post((req,res) => {
    const teamNumber = parseInt(req.body.number)

    const newTeam = new Team({
        teamNumber
    })

    newTeam.save()
        .then(() => res.json("Created"))
        .catch(err => res.json(err))
    /*
    let info = req.body.info
    const regex = /\d/
    if(!regex.test(info) || info.length()<7 || info(0)!="(" || info(info.length()-1)!=")")
    {
        res.json("Incorrect Formatting")
    }
    const extract = info.splice(1,info.length()-1)
    const iterate = extract.split(",")
    const isDigit = 
    const newTeam = new Team({

    })
    Admin.find()
        .then(info => res.json(info))
        .catch(err => res.status(400).json("Error" + err))
        */
})
module.exports = router