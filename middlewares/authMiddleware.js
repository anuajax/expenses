require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.checkLoggedIn = async (req,res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        if(decoded)
        {
            return next();
        }
        else return next({ status: 401, message: 'Unauthorized/ Please login first'});
    }
    catch(err){
        console.log(err);
        return next({ status: 401, message: 'Unauthorized'});
    }
}

exports.verifyUser = async (req,res,next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        //console.log(decoded);
        if(decoded && decoded.id === req.params.id)
        return next();
        else return next({ status: 401, message: 'Unauthorized user'});
    }
    catch(err){
        return next({ status: 401, message: 'Unauthorized user'});
    }
}