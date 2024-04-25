require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.checkLoggedIn = async (req,res,next) => {
    try{
        const cookie = req.headers.cookie;
        const token = cookie.split("=")[1];
        //const token = req.headers.authorization.split(" ")[1];
        const secret = req.originalUrl.includes('refresh') ? process.env.REFRESH_SECRET_KEY : process.env.SECRET_KEY;
        const decoded = await jwt.verify(token, secret);
        if(decoded)
        {
            return next();
        }
        else return next({ status: 401, message: 'Unauthorized/ Please login first'});
    }
    catch(err){
        console.log(err);
        return next({ status: 401, message: 'Token error'});
    }
}

exports.verifyUser = async (req,res,next) => {
    try{
        const cookie = req.headers.cookie;
        const token = cookie.split("=")[1];
        //const token = req.headers.authorization.split(" ")[1];
        const secret = req.originalUrl.includes('refresh') ? process.env.REFRESH_SECRET_KEY : process.env.SECRET_KEY;
        const decoded = await jwt.verify(token, secret);
        if (!decoded) return next({ status: 401,message: "Token expired" });
        if(decoded && decoded.id === req.params.id)
        return next();
        else return next({ status: 401, message: 'Unauthorized user'});
    }
    catch(err){
        return next({ status: 401, message: 'Unauthorized user'});
    }
}