const express = require('express');
const Item = require("../models/Item");
const router = express.Router();
const { checkLoggedIn, verifyUser} = require("../middlewares/authMiddleware");
const {io, createNotification} = require("../utils/socket");

io.listen(5001);
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', (userId) => {
        socket.join(userId);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const createItemService = async (body, param) => {
    let date = body.date;
    date = new Date(date).toLocaleDateString('en-IN');
    const item = new Item({name: body.name, amount: body.amount, date, type: body.type, user: param});
    const response = await item.save();
    return response;
}

router.get("/:id/items", checkLoggedIn, verifyUser, async (req,res,next) => {
    try
    {
        let items = await Item.find({user: req.params.id});
        if(items) return res.status(200).json(items);
        else return next({ status: 400, message: `Items Not found`})
    }
    catch(error)
    {
        console.error(error);
        return next({ status: 400, message: 'Not found'});
    }
});

router.post("/:id/items/new", checkLoggedIn, verifyUser,  async (req,res,next) => {
    const userId = req.params.id;
    try{
        const response = await createItemService(req.body,userId);
        if(response){
            createNotification(userId, "An Item was just created.");
            return res.status(201).json('Item created successfully');
        }
        else return next({ status: 400, message: 'Cannot save this item'});
    }
    catch(error){
        console.error(error);
       return next({ status: 400, message: 'Cannot create this item'});
    }
});


router.post("/:id/recurring-items/new",  async (req,res,next) => {
    try{
        const response = await createItemService(req.body, req.params);
        if(response){
            return res.status(201).json('Task executed. Item created successfully');
        }
        else return next({ status: 400, message: 'Cannot Execute Task'});
    }    
    catch(error){
        return next({ status: 400, message: 'Cannot Execute Task'});
    }
});

router.put("/:id/items/:itemid/edit", checkLoggedIn, verifyUser, async (req, res,next) => {
   try {
       await Item.findOneAndUpdate({_id: req.params.itemid}, {...req.body});
       return res.status(200).send('Item updated successfully');
   } catch (error) {
        console.error(error.message);
        return next({ status: 400, message: 'Error Updating Item'});
   }
});

router.delete("/:id/items/:itemid/delete", checkLoggedIn, verifyUser, async (req,res) => {
    try{
        await Item.findByIdAndDelete(req.params.itemid);
        res.status(200).send('Item deleted');
    }
    catch(error){
        console.error(error.message);
        res.status(400).json("Error deleting this item");
    }
});

module.exports = {router, createItemService};