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
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        profileImage: {
            type: Sequelize.STRING,
        },
        userType: {
            type: DataTypes.ENUM('user', 'artist', 'admin'),
            defaultValue: 'user',
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
        },
    }
);

//USER HISTORY TABLE
const User_History = db.define(
    "User_History",
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: DataTypes.NOW,
        }
    },
    {timestamps: false}
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
            allowNull: false,
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
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('lp', 'ep', 'single'),
        },
        totalTimeSec: {
            type: Sequelize.INTEGER,
        },
        albumImage: {
            type: Sequelize.STRING,
            allowNull: false,
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
            allowNull: false,
        }
    },
    {timestamps: false}
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
            allowNull: false,
        },
        totalTimeSec: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        link: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        totalPlays: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
        }
    },
    {timestamps: false}
);

//RELATIONS
Album.hasMany(Song, {onDelete: 'CASCADE'});
Song.belongsTo(Album);

User.hasMany(Album, {onDelete: 'CASCADE'});
Album.belongsTo(User);

User.hasMany(User_History, {onDelete: 'CASCADE'});
User_History.belongsTo(User);

Song.hasMany(User_History, {onDelete: 'CASCADE'});
User_History.belongsTo(Song);

const PlayList_User = db.define(
    "PlayList_User",
    {
        isOwner: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
);
PlaysList.belongsToMany(User, {through: "PlayList_User", onDelete: 'CASCADE', as: 'Users'});
User.belongsToMany(PlaysList, {through: "PlayList_User", onDelete: 'CASCADE', as: 'PlayLists'});

const Song_PlayList = db.define("Song_PlayList", {});
Song.belongsToMany(PlaysList, {through: "Song_PlayList", onDelete: 'CASCADE'});
PlaysList.belongsToMany(Song, {through: "Song_PlayList", onDelete: 'CASCADE'});

const Song_Genre = db.define("Song_Genre", {});
Song.belongsToMany(Genre, {through: "Song_Genre"});
Genre.belongsToMany(Song, {through: "Song_Genre"});

const Artist_Genre = db.define("Artist_Genre", {});
User.belongsToMany(Genre, {through: "Artist_Genre"});
Genre.belongsToMany(User, {through: "Artist_Genre"});

export { User, PlaysList, Album, Song, Genre, PlayList_User, Song_PlayList, Song_Genre, Artist_Genre, User_History }

