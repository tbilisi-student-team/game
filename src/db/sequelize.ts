import {Sequelize, DataTypes, Model} from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.PGSQL_HOST,
    password: process.env.PGSQL_PASSWORD,
    database: process.env.PGSQL_DATABASE,
    port: Number(process.env.PGSQL_PORT),
    username: process.env.PGSQL_USER,
});

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    theme: {
        type: DataTypes.STRING
    }
}, {
    // Other model options go here
});

export const Author = sequelize.define('Author', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    topicIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: [],
    },
    commentIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: [],
    }
});

export const Topic = sequelize.define('Topic', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    commentIds: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        defaultValue: [],
    }
})

export const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    childCommentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    emotions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    }
});

sequelize.sync().catch(error => console.error('Sequelize sync error', error));
