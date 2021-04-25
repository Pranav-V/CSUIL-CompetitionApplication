const router = require("express").Router()
let Answer = require("../models/answer.model")

router.route('/retrieveanswers').post((req,res) => {
    const frqID = req.body.frqID
    const query = {
        "frqID":frqID
    }
    
    Answer.find(query)
        .then(info => res.json(info))
        .catch(err => res.status(400).json("Error" + err))
})
router.route('/getProblemNames').post((req,res) => {
    const frqID = req.body.frqID
    const query = {
        "frqID":frqID
    }
    
    Answer.find(query)
        .then(info => {
            let spliced = info[0].frqNames.split(',')
            res.json(spliced)
        })
        .catch(err => res.status(400).json("Error" + err))
})
router.route('/addfrqanswers').post((req,res) => {
    const frqID = req.body.frqID
    const answers = req.body.answers
    const frqNames = req.body.frqNames

    const newAnswer = new Answer({
        "frqID":frqID,
        "answers":answers,
        "frqNames":frqNames
    })
    
    newAnswer.save()
        .then(() => res.json("Added"))
        .catch(err => res.status(400).json("Error" + err))
})

module.exports = router