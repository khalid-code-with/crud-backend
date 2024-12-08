

import jwt from 'jsonwebtoken';
import User from '../../models/usermodels.js';
const islogin = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // Pehle token ko declare karein
        console.log(token); // Phir log karein

        if (!token) return res.status(500).send({ success: false, message: "user unauthorized" });

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) return res.status(500).send({ success: false, message: "user unauthorized - invalid token" });

        const user = await User.findById(decode.userid).select("-password");
        if (!user) return res.status(500).send({ success: false, message: "user not found" });

        req.user = user; // Corrected this line
        next();

    } catch (error) {
        console.log(`error in login middleware: ${error.message}`);
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

export default islogin;

