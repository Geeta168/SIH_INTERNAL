import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
	participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }],
	lastMessage: { type: String, default: '' },
	lastMessageAt: { type: Date, default: Date.now },
},{ timestamps: true });

conversationSchema.index({ participants: 1 });

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
export default Conversation;
