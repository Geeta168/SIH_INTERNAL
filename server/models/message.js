import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
	sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
	content: { type: String, required: true },
	readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
},{ timestamps: true });

messageSchema.index({ conversation: 1, createdAt: 1 });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;
