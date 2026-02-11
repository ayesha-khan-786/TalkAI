import express from "express";
import Thread from "../models/Thread.js";
import getGroqAIAPIResponse from "../utils/groqai.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// test
router.post("/test",authMiddleware, async(req, res) => {
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
router.get("/thread",authMiddleware, async(req, res) => {
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
router.get("/thread/:threadId",authMiddleware, async(req, res) => {
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
router.delete("/thread/:threadId",authMiddleware, async(req, res) => {
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

// POST - /chat -> new msg in old threadId
router.post("/chat",authMiddleware, async(req, res) => {
    const {threadId, message} = req.body;

    // Step 1 -> Validate
    if(!threadId || !message) {
       return res.status(400).json({error: "Missing required fields"});
    }
    
    try {
        let thread = await Thread.findOne({threadId});
       
        // Step 2 -> create a new thread in DB if not exists
        if(!thread) {
           
            thread = new Thread({
                threadId,
                title: message,
                messages: [{role: "user", content: message}]
            });
        } else {
            thread.messages.push({role: "user", content: message});
        }

        // Step 3 -> Ask assistant reply from GroqAI
        const assistantReply = await getGroqAIAPIResponse(message);

        thread.messages.push({role: "assistant", content: assistantReply});     // store new rply in DB
        thread.updatedAt = new Date();
        
        await thread.save();
        res.json({reply: assistantReply});          // display all msgs on frontend
    
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Something went wrong"});
    }
});

export default router;