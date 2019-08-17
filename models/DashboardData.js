const mongoose = require('mongoose');

const todoItemSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ''
    },
    body: {
        type: String,
        default: ''
    },
    date: {
        type: String,
        default: Date.now
    }
});

const DashBoardDataSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    todo: [
        todoItemSchema
    ]
}, { collection: 'dashboarddata'});

const DashboardData = mongoose.model('DashboardData', DashBoardDataSchema);
module.exports = DashboardData;
