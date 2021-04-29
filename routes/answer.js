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
router.route('/changeFRQ/').post((req,res) => {
    const frqNames = req.body.frqNames
    Answer.find()
        .then(info => {
            info[0].frqNames = frqNames
            info[0].save()
                .then(() => res.json("updated"))
                .catch(err => res.json(err))
        })
        .catch(err => res.json(err))
})
router.route('/changeMC/').post((req,res) => {
    const answers = req.body.answers
    Answer.find()
        .then(info => {
            info[0].answers = answers
            info[0].save()
                .then(() => res.json("updated"))
                .catch(err => res.json(err))
        })
        .catch(err => res.json(err))
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