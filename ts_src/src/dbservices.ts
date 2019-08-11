import * as sqlite3 from 'sqlite3';
import { Ride } from './ride'

export class DBServices {
    db: sqlite3.Database;
    constructor(db: sqlite3.Database) {
        this.db = db;
    }

    createRideTableSchema() {
        const createRideTableSchema = `
        CREATE TABLE Rides
        (
        rideID INTEGER PRIMARY KEY AUTOINCREMENT,
        startLat DECIMAL NOT NULL,
        startLong DECIMAL NOT NULL,
        endLat DECIMAL NOT NULL,
        endLong DECIMAL NOT NULL,
        riderName TEXT NOT NULL,
        driverName TEXT NOT NULL,
        driverVehicle TEXT NOT NULL,
        created DATETIME default CURRENT_TIMESTAMP
        )
    `;

        return this.db.run(createRideTableSchema);
    }

    insertRecord(ride: Ride, callback: any) {
        let values = [ride.start_lat, ride.start_long, ride.end_lat, ride.end_long, ride.rider_name, ride.driver_name, ride.driver_vehicle];
        return this.db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, callback);
    }

    getRecord(id: number, callback: any) {
        return this.db.all('SELECT * FROM Rides WHERE rideID = ?', id, callback);
    }

    getAllRecords(callback: any) {
        return this.db.all('SELECT * FROM Rides', callback);
    }

    getByQuery(query: string, callback: any) {
        return this.db.all(query, callback);
    }

    getCount(callback: any) {
        return this.db.get('SELECT count(*) AS totalCount FROM Rides', [], callback);
    }

    getLastInsertRowId(callback: any) {
        return this.db.get('SELECT last_insert_rowid() AS id', [], callback);
    }
}