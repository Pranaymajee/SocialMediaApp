import express from "express"; //FOR LIBRARY
import bodyParser from "body-parser"; //TO PROCESS THE REQUEST BODY
import mongoose from "mongoose"; //FOR MONGO-DB ACCESS
import cors from "cors"; //FOR CROSS-ORIGIN REQUEST
import dotenv from "dotenv"; //FOR ENVIRONMENT VARIABLES
import multer from "multer"; //FOR FILE UPLOADS AND STORAGE
import helmet from "helmet"; //FOR REQUEST SAFETY
import morgan from "morgan"; //FOR LOGGING
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/post.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGUARATIONS */
const __filename = fileURLToPath(import.meta.url); //RETURNS THE FILENAME OF THE CODE WHICH IS EXECUTED
const __dirname = path.dirname(__filename); //RETURNS DIRECTORY NAME
dotenv.config(); //FOR USING .env FILES
// 👇🏻 INVOKING THE PACKAGES
const app = express(); 
app.use(express.json()); 
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
// 👇🏻 extended: true PRECISES THAT THE req.body OBJECT WILL CONTAIN VALUES OF ANY TYPE INSTEAD OF JUST STRINGS
app.use(bodyParser.json({ limit: "30mb", extended: true })); //RETURNS MIDDLEWARE THAT ONLY PARSES JSON
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); //PARSES INCOMING REQUESTS WITH URL-ENCODED PAYLOADS
app.use(cors());
// 👇🏻 express.static() IS A FUNCTION THAT TAKES A PATH, AND RETURNS A MIDDLEWARE THAT SERVES ALL FILES IN THAT PATH
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "public/assets");
    },
    filename : function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(PORT, () => console.log(`✅ 😎 Server Running on Port ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
})
.catch((error) => console.log(`❌😓 ${error} Server did not connect`));