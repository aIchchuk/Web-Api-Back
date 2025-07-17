import { User } from "../model/user.model.js";

export const getAllUsers = async (req, res, next) => {
    try {
        // Fetch all users from the database
        const users = await User.find();

        // Respond with the list of users
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};
