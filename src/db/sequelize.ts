import {Sequelize, DataTypes} from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.PGSQL_HOST,
    password: process.env.PGSQL_PASSWORD,
    database: process.env.PGSQL_DATABASE,
    port: Number(process.env.PGSQL_PORT),
    username: process.env.PGSQL_USER,
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    theme: {
        type: DataTypes.STRING
    },
});

const Topic = sequelize.define('Topic', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    authorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    authorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

const Emotion = sequelize.define('Emotion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    authorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

// Associations
// one-to-many - hasMany, belongsTo

// Topic-Comment
Topic.hasMany(Comment);
Comment.belongsTo(Topic);

// Comment-Emotion
Comment.hasMany(Emotion);
Emotion.belongsTo(Comment);

// Comment-Comment
Comment.hasMany(Comment, { as: 'ChildComment', foreignKey: 'ChildCommentId' });
Comment.belongsTo(Comment, { as: 'ParentComment', foreignKey: 'ParentCommentId' });

export {
  User,
  Topic,
  Comment,
  Emotion,
};

sequelize.sync().catch(error => console.error('Sequelize sync error', error));
