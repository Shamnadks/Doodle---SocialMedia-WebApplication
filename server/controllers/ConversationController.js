import ConversationModel from "../models/conversationModel.js";


export const newConversation = async (req, res) => {
  const newConversation = new ConversationModel({
    members: [req.body.senderId, req.body.receiverId],
    unreadCount:0
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
}


export const getConv = async (req, res) => {
  try {

    const conversation = await ConversationModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
    console.log(err)
  }
}


export const getConvIncTwo = async (req, res) => {
  try {
    const conversation = await ConversationModel.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
}


