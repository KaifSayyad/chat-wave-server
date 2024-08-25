import Message from './../models/messageModel.js'; // Adjust the import path according to your project structure
import Chat from './../models/chatModel.js'; // Adjust the import path according to your project structure
import User from './../models/userModel.js'; // Adjust the import path according to your project structure

const saveChat = async (req, res) => {
    try {
      const { userId, partnerId, messages } = req.body;
  
      if (!userId || !partnerId || !messages) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Save each message and get their IDs
      const messageIds = await Promise.all(messages.map(async (message) => {
        const savedMessage = await Message.create({
          body: message.body,
          from: message.from === 'me' ? userId : partnerId,
          timestamp: new Date() // Set current timestamp
        });
        return savedMessage._id;
      }));
  
      // Create a new chat with references to the saved messages
      const chat = await Chat.create({
        messages: messageIds
      });
  
      // Add the chat reference to both users' chats, ensuring no duplicates
      const userUpdateResult = await User.updateOne(
        { userId: userId },
        { $addToSet: { chats: chat._id } } // Use $addToSet to avoid duplicates
      );
  
      const partnerUpdateResult = await User.updateOne(
        { userId: partnerId },
        { $addToSet: { chats: chat._id } } // Use $addToSet to avoid duplicates
      );
  
      // Check if the updates were successful
      if (userUpdateResult.nModified === 0 && partnerUpdateResult.nModified === 0) {
        return res.status(404).json({ error: 'User(s) not found' });
      }
  
      res.status(201).json(chat);
    } catch (error) {
      console.error(error); // Log error for debugging
      res.status(500).json({ error: error.message });
    }
  };

const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by userId and populate the chats field
    const user = await User.findOne({ userId: userId }).populate('chats');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the array of chats
    res.status(200).json(user.chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { userId, chatId } = req.params;
    // console.log(req.params);
    // Find the chat by chatId and populate the messages field
    const chat = await Chat.findById(chatId).populate('messages');
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    // Modify the `from` field for each message based on the userId
    const messages = chat.messages.map(msg => ({
      ...msg._doc,
      from: msg.from === userId ? 'me' : 'partner'
    }));

    // Return the array of messages with the modified `from` field
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { saveChat, getUserChats, getChatMessages };
