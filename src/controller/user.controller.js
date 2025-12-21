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

export const getUserById = async (req, res, next) => {
    try {
            const {id} = req.params;
    
            const userById = await User.findById(req.params.id);
    
            return res.status(200).json({ message: 'User Id: Get' , data: userById });
    } catch (error) {
            next(error);
    }
}

export const updateUserById = async (req, res, next) => {
    try {
        
        const {id} = req.params;

        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

        if(!updatedUser) {
            return res.status(404).json({ message: 'user not found'});
        }

        return res.status(200).json({ message: 'User updated Successfully' });

    } catch (error) {
       next(error); 
    }
}

export const deleteUserById = async (req, res, next) => {
    try {
        const {id} = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if(!deletedUser) {
            return res.status(404).json({ message: 'User not found'});
        }
 
        return res.status(200).json({ message: 'User deleted Successfully' });
        
    } catch (error) {
        next(error);
    }
}