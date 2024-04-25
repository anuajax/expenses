const nodeSchedule = require('node-schedule');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const {createNotification} = require('../utils/socket');
const router = require('express').Router();
const {createItemService} = require('../routes/items');
const axios = require('axios');
const {calculateNextRun} = require('./dates');

class SchedulerService {
    constructor() {
        this.jobs = new Map(); // Keeps track of scheduled jobs
    }
    async init() {
        const tasks = await Task.find({nextRun: { $gte : new Date()}});
        if(tasks.length === 0) {
            console.log("No Scheduled Tasks");
            return;
        }
        tasks.forEach(task => this.scheduleTask(task));
    }
    async scheduleTask(task) {
        const job = nodeSchedule.scheduleJob(task.nextRun, async () => {
            await this.executeTaskAction(task);
        });
        this.jobs.set(task._id.toString(), job);
        console.log(this.jobs);
    }
    async rescheduleTask(task) {
        const taskMetadata = this.jobs.get(task._id.toString());
        console.log(taskMetadata);
        if (taskMetadata) taskMetadata.cancel();
        this.scheduleTask(task);
    }
   async updateTaskInDB(taskId, nextRun) {
        const task = await Task.findByIdAndUpdate(taskId, {nextRun});
        if(task) return true;
    }
    async executeTaskAction(task) {
        // Perform the task's specific action, e.g., making an HTTP request or a database operation
        try{
            const response = await createItemService(task.taskDetails,task.user);
            const task1 = task;
            if(response)
            {
                // Update the task's  `nextRun` in your database and in-memory
                const {frequency, interval, dayOfMonth} = task.recurrence;
                const nextRun = calculateNextRun(frequency, interval, dayOfMonth, task.nextRun);
                this.updateTaskInDB(task._id, nextRun);
                task1.nextRun=nextRun;
                this.rescheduleTask(task1);
                return { status :201, message: 'Item created successfully'};
            }   
            else return { status: 400, message: 'Cannot save this item'};
        }
        catch(error){
            console.error(error);
           return  { status: 400, message: 'Cannot save this item'};
        }
    }
    removeScheduledTask(taskId) {
        const job = this.jobs.get(taskId.toString());
        if (job) {
            job.cancel(); // Cancel the job
            this.jobs.delete(taskId.toString()); // Remove from the tracking map
        }
    }
}
const schedulerService = new SchedulerService();
module.exports = {router, schedulerService};

// Usage
// At application start:

// When adding/updating a task:
// Make sure to call schedulerService.scheduleTask(updatedTask) or schedulerService.updateScheduledTask(updatedTask)

// When removing a task:
// Call schedulerService.removeScheduledTask(taskId)
