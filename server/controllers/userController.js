import Users from './../models/userModel.js';

const addUser = async (req, res) => {
    const { userId, username, email } = req.body;
    // console.log("from controller", req.body);
    try {
        const user = await Users.create({
            userId,
            username,
            email,
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { addUser };