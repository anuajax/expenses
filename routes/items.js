const express = require('express');
const Item = require("../models/Item");
const router = express.Router();
const { checkLoggedIn, verifyUser} = require("../middlewares/authMiddleware");

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
     let date = req.body.date;
     date = new Date(date).toLocaleDateString('en-IN');
     console.log(date);
    try{
        console.log(req.params.id);
        const item = new Item({name: req.body.name, amount: req.body.amount, date, type: req.body.type, user: req.params.id});
        const response = await item.save();
        if(response){
            console.log(item);
        return res.status(201).json('Item created successfully');
        }
        else return next({ status: 400, message: 'Cannot save this item'});
    }
    catch(err)
    {
        console.error(err);
        return next({ status: 400, message: 'Cannot create this item'});
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
})
module.exports = router;