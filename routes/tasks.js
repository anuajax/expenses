const express = require("express");
const Item = require("../models/Item");
const Task = require("../models/Task");
const router = express.Router();
const { checkLoggedIn, verifyUser } = require("../middlewares/authMiddleware");
const {schedulerService} = require("../utils/SchedulerService");
const {startSession} = require('mongoose');

router.get(
  "/:id/items-recurring",
  checkLoggedIn,
  verifyUser,
  async (req, res, next) => {
    try {
      let items = await Task.find({ user: req.params.id });
      if (items) return res.status(200).json(items);
      else return next({ status: 400, message: `Tasks Not found` });
    } catch (error) {
      console.error(error);
      return next({ status: 400, message: "Not found" });
    }
  }
);

router.post(
  "/:id/items-recurring",
  checkLoggedIn,
  verifyUser,
  async (req, res, next) => {
    //const session = await startSession();
    try {
      //session.startTransaction();
      const { startDate, recurrence, nextRun, taskDetails } = req.body;
      const user = req.params.id;
      const newTask = new Task({
        startDate,
        recurrence,
        nextRun,
        taskDetails,
        user,
      });
      const start = new Date(newTask.startDate);
      const now = new Date();
      if(start.getDate()===now.getDate() && start.getMonth()===now.getMonth() && start.getFullYear()===now.getFullYear())
      start.setTime(now.getTime());
      start.setMinutes(start.getMinutes()+1);
      newTask.nextRun = start;
      
      //await session.commitTransaction();
      const responseTask = await newTask.save();
      if(responseTask){
        await schedulerService.scheduleTask(responseTask);
        return res.status(201).json("Task created and scheduled successfully.");
      }
    } catch (error) {
      // await session.abortTransaction();
      console.log(error);
      return next({ status: 403, message: "Cannot create a recurring item" });
    }
  }
);

router.delete(
  "/:id/items-recurring/:taskid",
  checkLoggedIn,
  verifyUser,
  async (req, res, next) => {
    try {
      const resp = await Task.findByIdAndDelete(req.params.taskid);
      if(resp)
        schedulerService.removeScheduledTask(req.params.taskid);
      res.status(204).send("Task removed. It will not be automatically added");
    } catch (error) {
      console.error(error.message);
      res.status(400).json("Error deleting this recurring task");
    }
  }
);

router.put(
  "/:id/items-recurring/:taskid",
  checkLoggedIn,
  verifyUser,
  async (req, res, next) => {
    try {
      const updatedtask = await Task.findOneAndUpdate(
        { _id: req.params.taskid },
        { ...req.body },
        { new: true }
      );
      schedulerService.rescheduleTask(updatedtask);
      return res.status(200).send("task updated and rescheduled successfully");
    } catch (error) {
      console.error(error.message);
      return next({ status: 400, message: "Error Updating task" });
    }
  }
);

module.exports = router;
