const express = require('express')
const moment = require('moment')
const router = express.Router()

const Expense = require('../models/Expense')

router.get('/expenses', function(req, res) {
    const date1 = req.query.d1
    const date2 = req.query.d2
    if (date1 && date2) {
        const date1Format = moment(date1).format('LLLL')
        const date2Format = moment(date2).format('LLLL')
        Expense.find({
                $and: [
                    { date: { $gt: date1Format } },
                    { date: { $lt: date2Format } }
                ]
            }).sort({ date: -1 })
            .then(function(expenses) {
                res.send(expenses)
            })
    } else if (date1 || date2) {
        const date = date1 ? date1 : date2
        const dateFormat = moment(date).format('LLLL')
        Expense.find({
                date: { $gt: dateFormat }
            }).sort({ date: -1 })
            .then(function(expenses) {
                res.send(expenses)
            })
    } else {
        Expense.find({}).sort({ date: -1 })
            .then(function(expenses) {
                res.send(expenses)
            })
    }
})

router.get('/expenses/:group', function(req, res) {
    const total = req.query.total
    const group = req.params.group
    if (total === 'true') {
        Expense.aggregate([{
            $match: { group: group }
        }, {
            $group: {
                _id: "$group",
                totalAmount: { $sum: "$amount" }
            }
        }]).then(function(totalAmount) {
            res.send(totalAmount)
        })
    } else {
        Expense.find({
            group: group
        }).then(function(expenses) {
            res.send(expenses)
        })
    }
})

router.post('/expense', function(req, res) {
    let exponse = new Expense(req.body)
    let date = req.body.date ? moment(req.body.date).format('LLLL') : moment().format('LLLL')
    exponse.date = date
    exponse.save().then(function() {
        console.log(`the amount of the expense: ${exponse.amount} and i spent my money on ${exponse.item}`);
    })
    res.status(201).send(exponse)
})

router.put('/update/:group1/:group2', function(req, res) {
    const group1 = req.params.group1
    const group2 = req.params.group2
    Expense.findOneAndUpdate({ group: group1 }, { group: group2 })
        .then(function(expense) {
            res.send(`Expense ${expense.item} changed to group ${group2}`)
        })
        .catch(err => console.log(err))
})

module.exports = router