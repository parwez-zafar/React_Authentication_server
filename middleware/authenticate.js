const jwt = require('jsonwebtoken');
const User = require('../model/userScheema');


const authenticate = async (req, res, next) => {
    try {
        let token = req.cookies.jwt_tokens;
        if (token) {
            let verify_token = await jwt.verify(token, process.env.SECRET_KEY)

            const UserRoute = await User.findOne({ _id: verify_token._id, 'tokens.token': token });

            req.token = token;
            req.UserRoute = UserRoute;
            req.userId = UserRoute._id;
            next();
        } else {
            res.status(401).send("json web token error")
        }


    } catch (err) {
        res.status(401).send('Unauthorized user')
    }
}
module.exports = authenticate;