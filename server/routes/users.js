import express from "express";
import userAuth from "../middleware/userAuth.js";
import aboutuser from "../models/aboutuser.js";
import userModel from "../models/userModel.js";

const router = express.Router();

// -----------------
// Get logged-in user's profile
// -----------------
router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = await aboutuser.findById(req.userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// -----------------
// Get user by ID (optional, public or admin use)
// -----------------
router.get("/:id", async (req, res) => {
  try {
    const user = await aboutuser.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------
// Update user
// -----------------
// Update logged-in user
router.put("/profile", userAuth, async (req, res) => {
  try {
    const updatedUser = await aboutuser.findByIdAndUpdate(req.userId, req.body, { new: true });
    res.json({ success: true, updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// -----------------
// Authenticated user search
// -----------------
router.get("/search", userAuth, async (req, res) => {
  try {
    const q = (req.query.username || '').toString();
    let users;
    
    if (!q || q.trim() === '') {
      // If no query, return all users (limit to 20 for performance)
      users = await userModel.find({}).select('username name email').limit(20);
    } else {
      // Search by username prefix
      users = await userModel.find({ username: { $regex: `^${q}`, $options: 'i' } }).select('username name email');
    }
    
    return res.json({ success: true, users });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
});

// -----------------
// Public routes (no authentication required)
// -----------------

// Public: Get all users
router.get("/public/all", async (req, res) => {
  try {
    // Return all users with basic public info (limit to 50 for performance)
    const users = await userModel.find({})
      .select('username name email createdAt lastLoginAt')
      .limit(50)
      .sort({ createdAt: -1 });
    
    return res.json({ success: true, users });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
});

// Public: Search users by username
router.get("/public/search", async (req, res) => {
  try {
    const q = (req.query.username || '').toString();
    let users;
    
    if (!q || q.trim() === '') {
      // If no query, return recent users (limit to 20 for performance)
      users = await userModel.find({})
        .select('username name email createdAt lastLoginAt')
        .limit(20)
        .sort({ createdAt: -1 });
    } else {
      // Search by username prefix (case insensitive)
      users = await userModel.find({ 
        username: { $regex: q, $options: 'i' } 
      }).select('username name email createdAt lastLoginAt').limit(20);
    }
    
    return res.json({ success: true, users });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
});

export default router;

