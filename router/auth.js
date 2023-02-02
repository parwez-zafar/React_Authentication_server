const { Router, raw } = require('express');
const express = require('express');
const router = express.Router();
require('../DB/connection');
const jwt = require('jsonwebtoken');
const User = require('../model/userScheema');
const bcrypt = require('bcryptjs');
const lodash = require("lodash")
const authenticate = require('../middleware/authenticate');
const { findOne } = require('../model/userScheema');

// router.get('/', (req, res) => {
//     res.send("Home Page from router");
// })
// router.get('/about', (req, res) => {
//     res.send("This is about page");
// })
// router.get('/contact', (req, res) => {
//     res.send("This is contact page");
// })
// router.get('/login', (req, res) => {
//     res.send("This is Login Page");
// })
// router.get('/signup', (req, res) => {
//     res.send("This is signup page");
// })





router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, confirm_password } = req.body;

    if (!name || !email || !phone || !work || !password || !confirm_password) {
        return res.status(422).json({ error: "fill data properly" });
    }


    try {
        const userExist = await User.findOne({ email: email })

        if (userExist) {
            return res.status(422).json({ error: "email already exist" });
        }
        if (password != confirm_password) {
            return res.status(422).json({ error: 'password not mached' })
        }
        else {
            const user = new User({ name, email, phone, work, password, confirm_password });
            // securing password
            await user.save();
            res.status(201).json({ message: 'User registration successful' });
        }

    } catch (err) {
        console.log(err);
    }
})
router.post('/login', async (req, res) => {
    // console.log(req.body);
    // res.json({ message: req.body })
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "please fill data" });

        }

        const login_email = await User.findOne({ email });

        if (login_email) {
            // console.log(login_email);
            const isMatch = await bcrypt.compare(password, login_email.password);

            // generating tokens
            let token = await login_email.generateAuthToken();

            // saving tokens to cookies
            // console.log('saving');
            res.cookie("jwt_tokens", token, {
                expires: new Date(Date.now() + 2592000000),
                httpOnly: true,
            });
            // console.log(token);


            if (isMatch)
                res.json({ message: 'login successfully' });
            else
                res.status(400).json({ error: 'invalid credentials' })
        }
        else {
            res.status(400).json({ error: 'invalid credentials' })
        }


    } catch (err) {
        console.log(arr);
    }
})



// about page
router.get('/about', authenticate, (req, res) => {
    const user = lodash.pick(req.UserRoute, ["name", "email", "phone", "work"])
    res.status(200).send(user)
})
// sending data to contact
router.get('/contactData', authenticate, (req, res) => {
    const user = lodash.pick(req.UserRoute, ["name", "email", "phone"])
    res.status(200).send(user)
})
router.get('/checkLog', authenticate, (req, res) => {
    const user = lodash.pick(req.UserRoute, ["name", "email", "phone"])
    res.status(200).send("user")
})

// contact page
router.post('/contactD', authenticate, async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        // console.log(req.body);
        if (!name || !email || !phone || !message) {
            console.log("error in contact form");
            return res.json({ error: "fill message" })
        }

        const userData = await User.findOne({ _id: req.userId });

        if (userData) {
            const userMessage = await userData.addMessage(name, email, phone, message);
            await userData.save();

            res.status(201).json({ message: "message sent successfully" });
        }
    }
    catch (error) {
        console.log(err);

    }

})


// Logout page
router.get('/logout', (req, res) => {
    res.clearCookie('jwt_tokens', { path: '/' });
    // console.log("logout page ");
    res.status(200).send("Logut page");
})

module.exports = router;
