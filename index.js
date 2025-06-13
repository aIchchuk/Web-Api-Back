const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./model/userModel'); // ✅ Use PascalCase or proper name
const userModel = require('./model/userModel');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/toot_music_streaming');


app.post('/login', (req,res) => {
    const {email, password} = req.body;
    userModel.findOne({email: email})
    .then(user => {
        if(user) {
            if(user.password === password){
                res.json("success")
            }else{
                res.json("the password is incorrect")
            }
        }else{
            res.json("No user detected")
        }
    })
})



app.post('/register', async (req, res) => {
  try {
    console.log("Received data on /register:", req.body);
    
    const newUser = await User.create(req.body); // ✅ Use correct variable
    res.json(newUser);
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

app.listen(5000, () => {
  console.log("server is running");
});
