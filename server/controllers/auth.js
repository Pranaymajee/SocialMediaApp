import bcrypt from "bcrypt"; //FOR PASSWORD ENCRYPTION
import jwt from "jsonwebtoken"; // WEB TOKEN FOR AUTHORIZATION
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => { //CALLING MONGO DATABASE
    try {
        /* WHEN THE USER INPUTS HIS DATA IN THE REGISTER PAGE,
        WE GRAB THEM FROM req.body */
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt(); //ENCYPTION PROVIDED BY bcrypt
        const passwordHash = await bcrypt.hash(password, salt); //ENCRYPTING THE password

        /* ASSIGNING THE NEW USER'S DATA FROM THE REGISTER PAGE TO VARIABLES BELOW
        AND STORING THEM IN newUser */
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })
        // save() IS A MONGOOSE METHOD TO SAVE DATA THAT RETURNS A PROMISE THAT WE CAN AWAIT
        const savedUser = await newUser.save();
        res.status(201).json(savedUser); //SENDING JSON VERSION OF savedUser AS RESPONSE
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        /* GRABBING email AND password FROM req.body AND STORING THEM IN user */
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist." });

        // DETERMINING IF THE USER'S PASS MATCHES WITH THE PASS STORED IN DAYABASE
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials." });

        // SYNTAX : jwt.sign(payload, secretOrPrivateKey)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        //DELETING THE PASS SO THAT IT DOESN'T GET SENT TO THE FRONT-END
        delete user.password; 

        res.status(200).json({ token, user }); //SENDING JSON VERSION OF token AND user AS RESPONSE
    } catch(err){
        res.status(500).json({ error: err.message });
    }
};