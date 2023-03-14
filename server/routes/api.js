const express = require('express')
const moment = require('moment')
const router = express.Router()

const Expense = require('../models/Expense')

router.get('/expenses', function(req, res) {
    const d1 = moment(req.query.d1).format('LLLL')
    const d2 = moment(req.query.d2).format('LLLL')
    const filtiringExpensesByDate = []
    Expense.find({}).sort({ date: -1 }).then(function(expenses) {
        if (d1 && d2) {
            for (const expense of expenses) {
                if (expense.date >= d1 && expense.date <= d2) {
                    filtiringExpensesByDate.push(expense)
                }
            }
            res.send(filtiringExpensesByDate)
        } else if (d1 || d2) {
            const d = d1 ? d1 : d2
            for (const expense of expenses) {
                if (expense.date >= d) {
                    filtiringExpensesByDate.push(expense)
                }
            }
            res.send(filtiringExpensesByDate)
        } else {
            res.send(expenses)
        }
    })

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
    let e = new Expense(req.body)
    let date = req.body.date ? moment(req.body.date).format('LLLL') : moment().format('LLLL')
    e.date = date
    e.save().then(function() {
        console.log(`the amount of the expense: ${e.amount} and i spent my money on ${e.item}`);
    })
    res.status(201).send(e)
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

// router.delete('/apocalypse', function(req, res) {
//     Person.deleteMany({})
//         .then(function(person) {
//             res.status(204).send("all persons removed")
//         })
//         .catch(err => console.log(err))
// })

module.exports = router