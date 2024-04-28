const User = require("../models/user");
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { verifyUser, checkLoggedIn } = require("../middlewares/authMiddleware");
const match = require("nodemon/lib/monitor/match");
const crypto = require('crypto');
const sendEmail = require("./sendEmail");
const  { emailTemplate } = require("./emailTemplate");
const ErrorResponse = require("../error");

router.get('/users',  checkLoggedIn, verifyUser, async (req,res,next) => {
    try{
    let user = await User.findById(req.params.id);
    if(user) return res.status(200).json({user});
    }
    catch(err){
        return next(new ErrorResponse('User not found', 400));
    }

})

router.post("/register", async (req,res,next) => {
    let { name, email, tel} = req.body;
    try{
        let user = await User.findOne({ email });
        if(user)
        return next(new ErrorResponse(`User with that email already exists`, 401));
        else
        {
            //let newUser = await User.create(req.body);
            let newUser = new User({...req.body});
            let hasedPassword = await bcrypt.hash(newUser.password, 10);
            newUser.password = hasedPassword;
            let response = await newUser.save();
            if(response)
            {
                let token = jwt.sign({id: newUser._id, name, email, tel}, process.env.SECRET_KEY, { expiresIn: '24h'});
                return res.status(200).json({user:{ id: newUser._id, name, email, tel}, token});
            }
        }
    }
    catch(err){
        console.error(err);
        return next(err);
    }
});

router.post("/login", async (req,res,next) => {
    try{
        let user = await User.findOne({ email: req.body.email });
        if(user === null) 
        return next(new ErrorResponse("Email not found! Please register", 401));
        let {name, email, tel} = user;
        let matchPassword = await bcrypt.compare(req.body.password, user.password);
        if(!matchPassword) return next(new ErrorResponse('Oops! Invalid credentials',401));
         let token = jwt.sign({id: user._id, name, email, tel}, process.env.SECRET_KEY, { expiresIn: '10d' });
         let refreshToken = jwt.sign({id: user._id, name, email, tel}, process.env.REFRESH_SECRET_KEY, { expiresIn: '10d' });
         res.cookie(user._id, token, {
            path: "/",
            expires: new Date(Date.now()+1000*3600*24),
            httpOnly: true,
            secure: true,
            sameSite: "lax"
         })
         return res.status(200).json({user: { id: user._id, name, email, tel}, token, refreshToken});
    }
    catch(err){
        return next(err);
    }
});

router.post("/users/:id/refresh", checkLoggedIn, verifyUser, async (req,res,next) => {
    try {
        let {id, name, email, tel} = req.body.user;
        const newAccessToken = jwt.sign({id, name, email, tel}, process.env.SECRET_KEY, { expiresIn: '10d' });
        res.status(201).send({authToken: newAccessToken});
    } catch (error) {
        next(error);
    }
})

router.post("/refresh", async (req,res,next) => {
    try {
        const cookie = req.headers.cookie;//split("=")[1];
        const token = cookie.split('=')[1];
        if(!token)
            return res.status(401).json({message: 'Unauthorized, cannot refresh token'});
        const user = await jwt.verify(token, process.env.SECRET_KEY);
        const {id, name, email, tel} = user;
        res.clearCookie(id);
        req.cookies[`${id}`]='';
        const newAccessToken = jwt.sign({id, name, email, tel}, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.cookie(id, newAccessToken, {
            path: "/",
            expires: new Date(Date.now()+1000*60*60*24),
            httpOnly: true,
            sameSite: "lax"
        })
        res.status(201).send({token: newAccessToken});
    } catch (error) {
        next(error);
    }
})

router.post("/logout", checkLoggedIn, verifyUser, (req,res,next) => {

    return res.status(200).json("Logged out successfully");
})

router.post("/users/:id/changepass", checkLoggedIn, verifyUser, async (req,res,next) => {
    try{
    const user = await User.findById(req.params.id);
    if(user){
        const { password, newPassword, confirmNewPassword } = req.body;
        let matchPassword = await bcrypt.compare(password, user.password);
        if(!matchPassword){
            return next(new ErrorResponse('Oops! Incorrect password. Try Forgot Password', 401));
        }
        if(newPassword !== confirmNewPassword ){
            return next(new ErrorResponse("New Password and confirm passwords do not match", 401));
        }
        const hasedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hasedNewPassword;
        const response = await user.save();
        if(response){
            return res.status(201).json("Password changed successfully");
        }
    }
    }
    catch(error){
        return next({message: error.message});
    }
});


router.post("/forgot", async (req,res, next) => {
    const { email } = req.body;
    try{
        const user = await User.findOne({ email });
        if(!user) {
            return next(new ErrorResponse("We could not send a mail to that email id. Please enter correct email",400));
        }
        const token = crypto.randomBytes(20).toString("hex");
        //user.resetPasswordToken = crypto.createHash('sha256').update(token).digest("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpiration = Date.now() + 60 * (60 * 1000);
        await user.save();
        
        try{
           await sendEmail({
                to: user.email,
                body: emailTemplate(token)
            });
           
            return res.status(200).json(`Email with reset link sent to ${email}. Please check your Inbox`);
        }
        catch(error){
            user.resetPasswordToken = undefined;
            user.resetPasswordExpiration = undefined;
            await user.save();
            console.log(error)
            return next(error);
        }
    }
    catch(err){
        return next(err);
    }
})

router.post("/resetpass/:resetPassToken", async (req,res,next) => {
    const resetPasswordToken = req.params.resetPassToken;
    //crypto.createHash("sha256").update(req.params.resetPassToken).digest("hex");
    const {  newPassword, confirmNewPassword } = req.body;

    try {
        const user = await User.findOne({resetPasswordToken});
        if(!user)
            return next(new ErrorResponse('Reset password token Invalid', 401));
        if(newPassword !== confirmNewPassword )
            return next(new ErrorResponse("Password and confirm passwords do not match",401));
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        res.status(200).json("Password reset successfully!");
    } catch (error) {
        return next({status: 500, message: error.message})
    }
})
module.exports = router;