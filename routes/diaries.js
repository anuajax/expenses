const express = require('express');
const Diary = require( '../models/Diary');
const {  checkLoggedIn, verifyUser } = require("../middlewares/authMiddleware");
const diaryRouter = express.Router();

diaryRouter.get("/:id/diaries", checkLoggedIn, verifyUser, async (req, res, next) => {
    try {
        let diaries = await Diary.find({user: req.params.id});
        if(diaries) 
        { 
            return res.status(200).json(diaries);
            console.log(diaries);
        }
        else return next({ status: 400, message: 'No diaries found'});
    } catch (error) {
        return next({ status: 400, message: 'Error fetching diaries'});
    }
})


diaryRouter.post("/:id/diaries/new", checkLoggedIn, verifyUser, async (req,res,next) => {
    try {
        let diary = await Diary.findOne({year: req.body.year, user: req.params.id});
        if(diary)
            return next({ status: 400, message: 'Diary for year already exists.'});
        diary = new Diary( { year: req.body.year, user: req.params.id } );
        const response = await diary.save();
        if(response)
        return res.status(201).json(`Diary created for year ${req.body.year}`);
        else return next({ status: 400, message: 'Diary cannot be created'})
        }
    catch(error) {
        console.log(error);
        return next({ status: 400, message: 'Error creating diary'});
    }
});

diaryRouter.put("/:id/diaries/:year/:diaryid/edit", checkLoggedIn, verifyUser,  (req,res,next) => {
    return next({ status: 403, message: 'Editing operation on this is not allowed'});
});

diaryRouter.delete("/:id/diaries/:year/:diaryid/delete", checkLoggedIn, verifyUser, async (req,res,next) => {
    let response = await Diary.findByIdAndRemove(req.params.diaryid);
    if(response)
    {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    }
    else {
        let err = new Error(`Error Deleting Diary`);
        return next(err);
    }
});



module.exports =  diaryRouter;