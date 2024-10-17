import Sequelize from 'sequelize';
import db from './db';

//USER TABLE
const User = db.define(
    "User",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING,
            notNull: true,
        },
        email: {
            type: Sequelize.STRING,
            notNull: true,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            notNull: true,
        },
        status: {
            type: Sequelize.BOOLEAN,
            notNull: true,
        },
        profileImage: {
            type: Sequelize.STRING,
            notNull: false,
        }
    }
)

//PLAYLIST TABLE
const PlaysList = db.define(
    "PlayList",
    {

    }
)

//ARTIST TABLE
const Artist = db.define(
    "Artist",
    {

    }
)

//ALBUM TABLE
const Album = db.define(
    "Album",
    {

    }
)

//SONG TABLE
const Song = db.define(
    "Song",
    {

    }
)

export { User, PlaysList, Artist, Album, Song }

