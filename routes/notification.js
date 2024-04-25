const express = require('express');
const Notification = require('../models/Notification');
const {checkLoggedIn, verifyUser} = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/:id/notifications', checkLoggedIn, verifyUser, async (req,res,next) => {
    try{
        const notif = await Notification.find({user: req.params.id, read: false});
        if( notif )
        return res.status(200).json(notif);
        else return next({status: 500, message: "Error fetching notifications"})
    }
    catch(error){
        return next({status: 500, message: "Error fetching notifications"})
    }
});

module.exports=router;