const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userScheema = new mongoose.Schema({
    name: {
        type: String,
        requird: true,
    },
    email: {
        type: String,
        required: true,

    },
    phone: {
        type: Number,
        required: true,
    },
    work: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirm_password: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: false,
            }
        }
    ]
})


// password Hashing
userScheema.pre('save', async function (next) {
    if (this.isModified('password')) {
        console.log("bcrypt");
        this.password = await bcrypt.hash(this.password, 12);
        this.confirm_password = await bcrypt.hash(this.confirm_password, 12);
    }
    next();
})

// Token generating
userScheema.methods.generateAuthToken = async function () {
    try {

        let token = await jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    }
    catch (err) {
        console.log(err);
    }
}

const User = mongoose.model('USER', userScheema);
module.exports = User;