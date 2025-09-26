import Conversation from '../models/conversation.js';
import Message from '../models/message.js';

export const getOrCreateConversation = async (req, res) => {
	try {
		const userId = req.userId;
		const { otherUserId } = req.body;
		if (!otherUserId) return res.json({ success: false, message: 'otherUserId required' });

		let convo = await Conversation.findOne({ participants: { $all: [userId, otherUserId] } });
		if (!convo) {
			convo = await Conversation.create({ participants: [userId, otherUserId] });
		}
		return res.json({ success: true, conversation: convo });
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}
}

export const listConversations = async (req, res) => {
	try {
		const userId = req.userId;
		const convos = await Conversation.find({ participants: userId })
			.sort({ updatedAt: -1 });
		return res.json({ success: true, conversations: convos });
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}
}

export const sendMessage = async (req, res) => {
	try {
		const userId = req.userId;
		const { conversationId, content } = req.body;
		if (!conversationId || !content) return res.json({ success: false, message: 'conversationId and content required' });

		const message = await Message.create({ conversation: conversationId, sender: userId, content });
		await Conversation.findByIdAndUpdate(conversationId, { lastMessage: content, lastMessageAt: new Date() });
		return res.json({ success: true, message: message });
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}
}

export const listMessages = async (req, res) => {
	try {
		const { conversationId } = req.params;
		if (!conversationId) return res.json({ success: false, message: 'conversationId required' });
		const messages = await Message.find({ conversation: conversationId })
			.sort({ createdAt: 1 });
		return res.json({ success: true, messages });
	} catch (err) {
		return res.json({ success: false, message: err.message });
	}
}
