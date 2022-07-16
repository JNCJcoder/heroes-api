const { v4: uuidv4 } = require('uuid');
const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
    id: {
        type: Number,
        required: true,
        default: uuidv4
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//mocha workaround
module.exports = Mongoose.models.users || Mongoose.model('users', UserSchema);