const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    uuid: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

const Message = mongoose.model('Message', messageSchema)
module.exports = Message