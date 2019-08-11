import { Request, Response } from "express";
import { DBServices } from './dbservices';
import { Ride } from "./ride";

export let dbservices: DBServices;

export const setDBservice = (dbser: DBServices) => {
    dbservices = dbser
}

export const health = (req: Request, res: Response) => {
    res.send('Healthy')
};

export const add = async (req: Request, res: Response) => {
    let rideObj = req.body as Ride;
    if (rideObj.start_lat < -90 || rideObj.start_lat > 90 || rideObj.start_long < -180 || rideObj.start_long > 180) {
        return res.send({
            error_code: 'VALIDATION_ERROR',
            message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
        });
    }

    if (rideObj.end_lat < -90 || rideObj.end_lat > 90 || rideObj.end_long < -180 || rideObj.end_long > 180) {
        return res.send({
            error_code: 'VALIDATION_ERROR',
            message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively'
        });
    }

    if (rideObj.rider_name && rideObj.rider_name.length < 1) {
        return res.send({
            error_code: 'VALIDATION_ERROR',
            message: 'Rider name must be a non empty string'
        });
    }

    if (rideObj.driver_name && rideObj.driver_name.length < 1) {
        return res.send({
            error_code: 'VALIDATION_ERROR',
            message: 'Driver name must be a non empty string'
        });
    }

    if (rideObj.driver_vehicle && rideObj.driver_vehicle.length < 1) {
        return res.send({
            error_code: 'VALIDATION_ERROR',
            message: 'Driver vehicle name must be a non empty string'
        });
    }

    await dbservices.insertRecord(rideObj, function (err: any) {
        if (err) {
            return res.send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            });
        }
        dbservices.getLastInsertRowId(function (err: any, res2: any) {
            if (err) {
                return res.send({
                    error_code: 'SERVER_ERROR',
                    message: 'Unknown error'
                });
            }
            dbservices.getRecord(res2.id, function (err: any, rows: any) {
                if (err) {
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    });
                }
                if (rows.length === 0) {
                    return res.send({
                        error_code: 'RIDES_NOT_FOUND_ERROR',
                        message: 'Could not find any rides'
                    });
                }

                res.send(rows);
            });
        });

    });

}

export const search = (req: Request, res: Response) => {
    var query = 'SELECT * FROM Rides';
    if (req.query.sort) {
        query += ' ORDER BY ' + req.query.sort
    } else {
        query += ' ORDER BY created'
    }
    if (req.query.order && req.query.order == 'desc') {
        query += ' desc'
    } else {
        query += ' asc'
    }
    if (req.query.limit) {
        query += ' LIMIT ' + Number(req.query.limit)
    }
    if (req.query.page && req.query.limit) {
        query += ' OFFSET ' + (Number(req.query.page - 1) * Number(req.query.limit))
    }
    dbservices.getByQuery(query, function (err: any, rows: any) {
        if (err) {
            return res.send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            });
        }

        if (rows.length === 0) {
            return res.send({
                error_code: 'RIDES_NOT_FOUND_ERROR',
                message: 'Could not find any rides'
            });
        }
        if (req.query.fetch_total_count && req.query.fetch_total_count == 'true') {
            dbservices.getCount(function (err: any, res1: any) {
                if (err) {
                    return res.send({
                        error_code: 'SERVER_ERROR',
                        message: 'Unknown error'
                    });
                }
                res.send({
                    totalCount: res1.totalCount,
                    records: rows
                });
            });
        } else {
            res.send({
                records: rows
            });
        }
    })
}

export const getById = (req: Request, res: Response) => {
    dbservices.getRecord(req.params.id, function (err: any, rows: any) {
        if (err) {
            return res.send({
                error_code: 'SERVER_ERROR',
                message: 'Unknown error'
            });
        }

        if (rows.length === 0) {
            return res.send({
                error_code: 'RIDES_NOT_FOUND_ERROR',
                message: 'Could not find any rides'
            });
        }

        res.send(rows);
    });
}
