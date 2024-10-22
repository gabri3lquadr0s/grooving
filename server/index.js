import dotenv from 'dotenv';
import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import authRoutes from './src/routes/auth/auth-routes.js';
import userRoutes from './src/routes/user/user-routes.js';
import albumRoutes from './src/routes/album/album-routes.js';
import songRoutes from './src/routes/song/song-routes.js';
import playlistRoutes from './src/routes/playlist/playlist-routes.js';
import db from './src/db/db.js';
import { User, PlaysList, Album, Song, Genre } from './src/db/models.js'

dotenv.config();
const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use("/v1/auth", authRoutes);
app.use("/v1/user", userRoutes);
app.use("/v1/album", albumRoutes);
app.use("/v1/song", songRoutes);
app.use("/v1/playlist", playlistRoutes);
app.get('/', (req, res) => {
    return res.status(200).json({"msg": "Welcome to the Grooving API"});
});

try {
    db.sync({})
        .then(() => {
            console.log("All models were synchronized successfully.");
        })
        .catch((error) => {
            console.error("Error synchronizing the models:", error);
        });
    app.listen(process.env.PORT || 8000, () => console.log(`Server running on http://localhost:${process.env.PORT || 8000}\n`));
} catch(err) {
    console.error(`\nError in running server: ${err}\n`);
}