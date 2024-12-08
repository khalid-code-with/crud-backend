//  const express=require('express');
// const { default: mongoose, Types } = require('mongoose');
//  const app=express();
//  const PORT=5000;
//  const cors=require("cors");
//   app.use(cors());
//  app.use(express.json())
//   // connection to database
//   mongoose.connect(`mongodb://localhost:27017/crud_operation`).then(() => {
//     console.log("db connection is successfully");
// }).catch((error)=>{
//     console.log(error)
// });

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String, 
//         required: true,
//     },
//     email: {
//         type: String, 
//         required: true,
//     },
//     password: {
//         type: String, 
//         required: true,
//     },
// }, { timestamps: true });

// // Ensure you are parsing the request body correctly in your Express app


// // Model creation
// const User = mongoose.model("User", userSchema);
// // create user
//   app.post("/createuser", async (req,res)=>{
//      try {
//          const bodydata=req.body;
//          const user=new User(bodydata);
//          const userdata= await user.save()
//          res.send(userdata);
//          console.log(userdata);
//      } catch (error) {
//          res.send(error);
//      }
//   });
// // read all user
// app.get("/readalluser", async(req,res)=>{
//     try {
//          const userDATA=await User.find({});
//          res.send(userDATA);
//     } catch (error) {
//         res.send(error);
//     }
// })

//   app.get("/read/:id", async(req,res)=>{
//     try {
//          const id=req.params.id;
//          const user=await User.findById({_id:id});
//          res.send(user);
//     } catch (error) {
//         res.send(error);
//     }
//   });
//   //update user
//   app.put("/updateuser/:id",async(req,res)=>{
//     try {
//         const id=req.params.id;
// const user=await User.findByIdAndUpdate({_id:id},req.body,
//     {new:true});
//    res.send(user);
//     } catch (error) {
//         res.send(error); 
//     }
//   });
//    app.delete("/delete/:id",async(req,res)=>{
//     try {
//         const id=req.params.id;
//     const user=await User.findByIdAndDelete({_id:id});
//     res.send(user);
//     } catch (error) {
//         res.send(error); 
//     }
    
//    })
//   app.listen(PORT,()=>{
//     console.log(`server is runing on successfully ${PORT}`)
//   })

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connection to MongoDB Atlas
const dbURI = 'mongodb+srv://khalid70428khan:0JWGe6w41inRCdYz@cluster0.4jjor.mongodb.net/merncrudoperation?retryWrites=true&w=majority';

mongoose.connect(dbURI)
    .then(() => {
        console.log('Connected to MongoDB Atlas successfully!');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB Atlas:', error);
    });

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Model creation
const User = mongoose.model("User", userSchema);

// Create user
app.post("/createuser", async (req, res) => {
    try {
        const bodydata = req.body;
        const user = new User(bodydata);
        const userdata = await user.save();
        res.send(userdata);
        console.log(userdata);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read all users
app.get("/readalluser", async (req, res) => {
    try {
        const userDATA = await User.find({});
        res.send(userDATA);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Read single user by ID
app.get("/read/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update user by ID
app.put("/updateuser/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete user by ID
app.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
});
