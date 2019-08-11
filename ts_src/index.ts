import express from 'express';
import * as appController from "./src/app";
import * as sqlite3 from 'sqlite3';
import * as winston from "winston";
import bodyParser from "body-parser";
import { DBServices } from './src/dbservices';

const app = express();

let logger: winston.Logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: './logs/server.log'
        })
    ],
});
const db = new sqlite3.Database(':memory')
let dbser: DBServices;
const port = 8010

db.serialize(() => {
    dbser = new DBServices(db);
    // dbser.createRideTableSchema();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    appController.setDBservice(dbser);
    app.get('/health', appController.health);
    app.post('/rides', appController.add);
    app.get('/rides', appController.search);
    app.get('/rides/:id', appController.getById);
    app.use('/docs', express.static(__dirname + '/../public/docs'));

    app.listen(port, () => logger.info(`App started and listening on port ${port}`))
})

