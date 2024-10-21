import Sequelize, {DataTypes} from 'sequelize';
import db from './db.js';


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
        active: {
            type: Sequelize.BOOLEAN,
            notNull: true,
        },
        profileImage: {
            type: Sequelize.STRING,
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            notNull: true,
        }
    }
);

const Artist = db.define(
    "Artist",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            notNull: true,
        },
        description: {
            type: Sequelize.STRING,
        },
        profileImage: {
            type: Sequelize.STRING,
            notNull: false,
        },

    }
)

//PLAYLIST TABLE
const PlaysList = db.define(
    "PlayList",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            notNull: true,
        },

    }
);

const PlayList_Sharing = db.define(
    "PlayList_Sharing",
    {

    }
)

//ALBUM TABLE
const Album = db.define(
    "Album",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            notNull: true,
        },
        type: {
            type: DataTypes.ENUM('lp', 'ep', 'single'),
        },
        totalTimeSec: {
            type: DataTypes.INTEGER,
            notNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            notNull: true,
        },

    }
);

const Genre = db.define(
    "Genre",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            notNull: true,
        }
    }
);

//SONG TABLE
const Song = db.define(
    "Song",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    }
);

//RELATIONS
PlaysList.belongsToMany(User, {through: "PlayList_User"})
Song.belongsToMany(PlaysList, {through: "Song_PlayList"});
Song.belongsToMany(Album, {through: "Song_Album"});
Album.belongsToMany(Artist, {through: "Album_Artist"});
Album.belongsToMany(Genre, {through: "Album_Genre"});

export { User, PlaysList, Artist, Album, Song, Genre }

