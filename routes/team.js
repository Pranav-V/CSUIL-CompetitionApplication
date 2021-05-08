const router = require("express").Router()
let Team = require("../models/team.model")

router.route('/createteam').post((req,res) => {
    const team = parseInt(req.body.number)
    const frqAnswers = {
        "0":[0,"Unattempted",0],
        "1":[0,"Unattempted",0],
        "2":[0,"Unattempted",0],
        "3":[0,"Unattempted",0],
        "4":[0,"Unattempted",0],
        "5":[0,"Unattempted",0],
        "6":[0,"Unattempted",0],
        "7":[0,"Unattempted",0],
        "8":[0,"Unattempted",0],
        "9":[0,"Unattempted",0],
        "10":[0,"Unattempted",0],
        "11":[0,"Unattempted",0],
        "12":[0,"Unattempted",0]
    }
    const wScore = 0
    const teamScore = 0
    console.log("hereTeam")
    const newTeam = new Team({
        team,
        frqAnswers,
        wScore,
        teamScore
    })

    newTeam.save()
        .then(() => res.json("Created"))
        .catch(err => res.json(err))
})
router.route('/getscore').post((req,res) => {
    const query = {
        "team":req.body.team
    }
    Team.find(query)
        .then(data => res.json(data[0].wScore))
        .catch(err => res.json(err))
})
router.route('/delete').post((req,res) => {
    Team.deleteMany()
        .then(() => res.json("complete"))
        .catch(err => res.json(err))
})
router.route('/updateScore').post((req,res) => {
    const query = {
        "team":req.body.team
    }
    let score = req.body.score
    Team.find(query)
        .then(info => {
            info[0].teamScore += score
            info[0].save()
                .then(() => res.json("done"))
                .err(err => res.json(err))
        })
        .err(err => res.json(err))
        
})
router.route('/teamrank').post((req,res) => {
    Team.find().sort({teamScore:-1})
        .then(info => {
            const ranks = info.map(team => {
                return [team.team,team.teamScore,team.wScore]
            })
            res.json(ranks)
        })
        .catch(err => res.json(err))
})
router.route('/changeStatus').post((req,res) => {
    const problem = req.body.problem
    const status = req.body.status
    console.log("here")
    const query = {
        "team":req.body.team
    }

    Team.find(query)
        .then(info => {
            const copy = JSON.parse(JSON.stringify(info[0].frqAnswers))
            copy[problem][1] = status

            if(status=="Correct" && problem!=0)
            {
                copy[problem][2] = (copy[problem][0]*-5)+60
                info[0].wScore += copy[problem][2]
                info[0].teamScore += copy[problem][2] 
            }
            if(status=="Incorrect" || status=="Runtime Error" || status=="Compile Time Error")
            {
                copy[problem][0] = copy[problem][0] + 1
            }
            info[0].frqAnswers = copy
            info[0].save()
                .then(() => {console.log(info[0]);res.json("success")})
                .catch(err => res.json(err))
        })
        .catch(err => res.json(err))
})
router.route('/getTeamInfo/').post((req,res) => {
    const query = {
        "team":req.body.team
    }

    Team.find(query)
        .then(info => res.json(info[0].frqAnswers))
        .catch(err => res.json(err))
})
module.exports = router