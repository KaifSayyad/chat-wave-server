import User from './../models/userModel.js'; // Adjust the import path according to your project structure

const getSocket = async (req, res) => {
  try {
    const socket = await User.findOne({ collection: 'Users' });
    return res.status(200).json(socket);
    // Do something with the socket
  } catch (error) {
    console.error(error);
    // Handle the error
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateSocket = async (req, res) => {
  try {
    const { userId, socketId } = req.body;
    console.log(userId, socketId);
    await User.updateOne({ userId: userId }, { $set: { socket: socketId } });
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(user);
    return res.status(200).json({ message: 'Socket updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getSocket, updateSocket };
