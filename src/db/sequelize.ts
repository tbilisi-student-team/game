import { Sequelize, DataTypes } from 'sequelize';

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

sequelize.sync().catch(error => console.error('Sequelize sync error', error));
