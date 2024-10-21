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
            default: false,
        },
        profileImage: {
            type: Sequelize.STRING,
        },
        userType: {
            type: DataTypes.ENUM('user', 'artist', 'admin'),
            defaultValue: 'user',
            notNull: true,
        },
        description: {
            type: Sequelize.STRING,
        },
    }
);

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
        playlistImage: {
            type: Sequelize.STRING,
        },
    }
);

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
            type: Sequelize.INTEGER,
            notNull: true,
        },
        createdAt: {
            type: Sequelize.DATE,
            notNull: true,
            default: Sequelize.NOW,
        },
        albumImage: {
            type: Sequelize.STRING,
            notNull: false,
        },
    },
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
        name: {
            type: Sequelize.STRING,
            notNull: true,
        },
        totalTimeSec: {
            type: Sequelize.INTEGER,
            notNull: true,
        },
        link: {
            type: Sequelize.STRING,
            notNull: true,
        }
    },
);

const PlayList_User = db.define(
    "PlayList_User",
    {
        isOwner: {
            type: Sequelize.BOOLEAN,
            notNull: true,
            default: false,
        },
    },
);

//RELATIONS
PlaysList.belongsToMany(User, {through: "PlayList_User", onDelete: 'CASCADE'});
Song.belongsToMany(PlaysList, {through: "Song_PlayList", onDelete: 'CASCADE'});
Song.belongsToMany(Album, {through: "Song_Album", onDelete: 'CASCADE'});
Album.belongsToMany(User, {through: "Album_Artist", onDelete: 'CASCADE'});
Song.belongsToMany(Genre, {through: "Song_Genre"});
User.belongsToMany(Genre, {through: "Artist_Genre"});

export { User, PlaysList, Album, Song, Genre }

