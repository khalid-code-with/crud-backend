
import User from "../models/usermodels.js";
import bcrypt from 'bcryptjs';
import jwttoken from '../utils/jwtwebtoken.js';
export const userRagister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password, profilepic } = req.body;
        console.log(req.body);
        const user = await User.findOne({ username, email });

        if (user) {
            return res.status(400).send({ success: false, message: "UserName or Email Already Exist" });
        }

        const hashPassword = bcrypt.hashSync(password, 10);
        const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword,
            gender,
            profilepic: gender === "male" ? profileBoy : profileGirl
        });

        await newUser.save();
        jwttoken(newUser._id, res);

        return res.status(201).send({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilepic: newUser.profilepic,
            email: newUser.email,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
        console.log(error);
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).send({ success: false, message: "Email Doesn't Exist. Register" });

        const comparePass = bcrypt.compareSync(password, user.password || "");
        if (!comparePass) return res.status(400).send({ success: false, message: "Email or Password doesn't match" });

        jwttoken(user._id, res);

        return res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic,
            message: "Successfully Logged In"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
        console.log(error);
    }
};


export const userlogout =async(req,res)=>{
    try{
      res.cookie("jwt",'',{
        maxAge:0
      })
      res.status(200).send({message:"user logout"})
    }
    catch(error)
    {
        res.status(500).send({
            success: false,
            message: error.message,
        });
        console.log(error);
    }
}
