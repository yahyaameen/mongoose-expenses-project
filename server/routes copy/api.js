const express = require('express')
const router = express.Router()

const Person = require('../models/Expense')

router.get('/people', function(req, res) {
    Person.find({}).then(function(people) {
        res.send(people)
    })
})

router.post('/person', function(req, res) {
    let p = new Person(req.body)
    p.save()
    res.status(201).send(p)
})

router.put('/person:id', function(req, res) {
    console.log(req.params.id);
    Person.findByIdAndUpdate(req.params.id, { age: 80 })
        .then(function(person) {
            res.send(person)
        })
        .catch(err => console.log(err))
})

router.delete('/apocalypse', function(req, res) {
    Person.deleteMany({})
        .then(function(person) {
            res.status(204).send("all persons removed")
        })
        .catch(err => console.log(err))
})

module.exports = router