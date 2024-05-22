const jwt = require('jsonwebtoken');
// const User = require('../middilewear/authenticate');
const User = require('./models/DentalUser.js');
 
const Authenticate = async (req, res, next) => {
 const token = req.body.token;
    console.log(token)
    try {
        // request ke through token bhejna padega ye to sirf demo k liye hai 
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTVkOWUzMzZlYmM0MDAyMzZiZDlhODMiLCJpYXQiOjE3MDA2MzQ4MDJ9.wVxmCQzaDMz7PtZRdEw-C2XyXz8bFZjULoHvH_qrooo";
 
        const verifytoken = jwt.verify(token, "MOHDHASNAINKOUSARANSARIPARASIA");
        const rootuser = await User.findOne({ _id: verifytoken._id, "tokens.token": token })

        if (!rootuser) { throw new Error('user not found') }

        req.token = token;
        req.rootuser = rootuser;
        req.userID = rootuser._id;
        next();

    }
    catch (err) {
        res.status(401).send('unootherised no token');
        console.log(err);
    }
}

module.exports = Authenticate