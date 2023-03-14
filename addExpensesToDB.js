const mongoose = require('mongoose')
const expenses = require('./expenses')
const Expense = require('./server/models/Expense')

mongoose.connect("mongodb://127.0.0.1:27017/expensesDB", {
    useNewUrlParser: true,
}).catch((err) => console.log(err))

expenses.forEach(e => {
    let expense = new Expense(e);
    expense.save()
})