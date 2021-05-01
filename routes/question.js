const router = require("express").Router()
let Question = require("../models/question.model")

router.route('/giveFRQ').post((req,res) => {
    Question.find()
        .then(info => res.json(info[0].FRQ))
        .catch(err => res.status(400).json("Error" + err))
})
router.route('/addquestionSettings').post((req,res) => {

    const newQuestion = new Question({
        "FRQ": []
    })
    
    newQuestion.save()
        .then(() => res.json("Added"))
        .catch(err => res.status(400).json("Error" + err))
})
router.route('/delete').post((req,res) => {
    Question.find()
        .then(info => {
            info[0].FRQ = []
        })
})
router.route('/deleteQ').post((req,res) => {
    const i = req.body.index
    Question.find()
        .then(info => {
            const nA = [...info[0].FRQ]
            nA.splice(i,1)
            info[0].FRQ = nA
            info[0].save()
                .then(() => res.json("updated"))
                .catch(err => res.json(err))
        })
        .catch(err => res.json(err))
})
router.route('/addtoFRQ').post((req,res) => {
    const information = req.body.info
    Question.find()
        .then(info => {
            const nA = [...info[0].FRQ]
            nA.push(information)
            info[0].FRQ = nA
            info[0].save()
                .then(() => res.json("updated"))
                .catch(err => res.json(err))
        })
        .catch(err => res.json(err))
        
})

module.exports = router