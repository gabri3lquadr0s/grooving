require("dotenv").config();
const express = require('express');
const loginRoutes = require('./src/routes/login/login-routes');
const userRoutes = require('./src/routes/user/user-routes');
const albumRoutes = require('./src/routes/album/album-routes');
const artistRoutes = require('./src/routes/artist/artist-routes');
const songRoutes = require('./src/routes/song/song-routes');
const playlistRoutes = require('./src/routes/playlist/playlist-routes');
const db = require('./src/db/db');

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/v1/login", loginRoutes);
app.use("/v1/user", userRoutes);
app.use("/v1/album", albumRoutes);
app.use("/v1/artist", artistRoutes);
app.use("/v1/album", songRoutes);
app.use("/v1/playlist", playlistRoutes);
app.get('/', (req, res) => {
    return("Welcome to the v1 Sonar API!!");
});

try {
    db.sync(() => console.log(`\nConnected with database at port ${process.env.DB_HOST}`));
    app.listen(process.env.PORT || 8000, () => console.log(`Server running on http://localhost:${process.env.PORT || 8000}\n`));
} catch(err) {
    console.error(`\nError in running server: ${err}\n`);
}