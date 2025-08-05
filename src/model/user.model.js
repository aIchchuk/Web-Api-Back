import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // userId:{
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    fullName: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: false
    },
    userImageUrl: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
    // todo: image add

}, {timestamps: true}); // createdAt, updatedAt


export const User = mongoose.model("User", userSchema);