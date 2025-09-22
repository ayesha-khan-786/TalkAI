import express from "express";
import Thread from "../models/Thread.js";

const router = express.Router();

// test
router.post("/test", async(req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing new thread2"
        });
    
        const response = await thread.save();
        res.send(response);
    
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});

// Get all threads
router.get("/thread", async(req, res) => {
    try {
        const threads = await Thread.find({}).sort({updatedAt: -1});
        // decreasing order of updatedAt i.e most recent data at top
        res.json(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

// Route to send the info of a particular thread based on threadId
router.get("/thread/threadId", async(req, res) => {
    const {threadId} = req.params;
    
    try {
        const thread = await Thread.findOne({threadId});

        if(!thread) {
            res.status(404).json({error: "Thread is not found"});
        }
        res.json(thread.messages);
    
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

// delete
router.delete("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({threadId});
    
        if(!deletedThread) {
            res.status(404).json({error: "Thread not found"});
        }

        res.status(200).json({success: "Thread deleted successfully!"});
    
    }catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

export default router;