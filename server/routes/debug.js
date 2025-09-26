import express from 'express';
import mongoose from 'mongoose';
import userModel from '../models/userModel.js';

const router = express.Router();

router.get('/db', async (req, res) => {
	try {
		const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
		let users = null;
		try { users = await userModel.estimatedDocumentCount(); } catch {}
		return res.json({ success: true, state, users });
	} catch (e) {
		return res.json({ success: false, message: e.message });
	}
});

export default router;

