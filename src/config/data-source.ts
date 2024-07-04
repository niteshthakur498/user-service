import { DataSource } from "typeorm";
import path from "path";
require('dotenv').config();


const AppDataSource =  new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URI,
    logging: false,
    synchronize: true,
    entities: [`${__dirname}/../entities/**{.ts,.js}`],
    extra: {
        ssl: process.env.NODE_ENV === 'production' ? {
            rejectUnauthorized: false
        }:undefined
    }
})

AppDataSource
    .initialize()
    .then(() => {
        console.log(`Data Source has been initialized`);
    })
    .catch((err) => {
        console.error(`Data Source initialization error`, err);
    })

export default AppDataSource;