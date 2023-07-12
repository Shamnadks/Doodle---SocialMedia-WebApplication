
import ConversationModel from '../models/conversationModel.js'
import MessageModel from '../models/messageModel.js'
import jwt from 'jsonwebtoken'


export const newConversation = async (req, res) => {
    const newConversation = new ConversationModel({
        members: [req.body.senderId, req.body.receiverId],
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const getUnreadCount = async (req, res) => {
    try {
        const currentUserId = req.user
        const count = await MessageModel.countDocuments({
            conversationId: req.params.conversationId,
            read: false,
            receiver: currentUserId
          });
          
        res.status(200).json(count);
      } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err)
      }
}  

export const addMessage = async (req, res) => {
    const newMessage = new MessageModel(req.body);
    const conversationId = req.body.conversationId;
  
    try {
      const savedMessage = await newMessage.save();
      const conversation = await ConversationModel.findById(conversationId);
  
      conversation.lastMsg += 1;
      if (savedMessage.receiverId !== req.user.id) {
        conversation.unreadCount += 1;
      }
      await conversation.save();
  
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  


export const getMessage = async (req, res) => {
    try {
        const messages = await MessageModel.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
}





