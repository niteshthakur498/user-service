import { DataSource } from "typeorm";
require('dotenv').config({path: __dirname + '/../.env'})
const DATABASE_URL = process.env.DATABASE_URI;

console.log("HIIIIIIIII---"+DATABASE_URL);


const AppDataSource =  new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URI,
    logging: false,
    synchronize: true,
    entities: ["./src/Entities/**/*.ts"],
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