'use strict';

const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

describe('API tests', () => {
    before((done) => {
        db.serialize((err) => {
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
    });

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });

    describe('GET /rides/:id for 0 results', () => {
        it('should get no ride', (done) => {
            request(app).get('/rides/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    if (res.body.error_code == "RIDES_NOT_FOUND_ERROR") {
                        done();
                    }
                });

        })
    })

    describe('GET /rides for 0 results', () => {
        it('should get no rides', (done) => {
            request(app).get('/rides')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    if (res.body.error_code == "RIDES_NOT_FOUND_ERROR") {
                        done();
                    }
                });
        })
    })

    describe('POST /rides', () => {
        it('should return VALIDATION_ERROR for riderName empty', (done) => {
            var testRide = {
                "start_lat": "1.22334",
                "start_long": "2.33434",
                "end_lat": "4.8877",
                "end_long": "8.00999",
                "rider_name": "",
                "driver_name": "chinna",
                "driver_vehicle": "polo"
            }
            request(app).post('/rides')
                .send(testRide)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    if (res.body.error_code == 'VALIDATION_ERROR') {
                        done();
                    }
                });
        })
        it('should return VALIDATION_ERROR for driverName empty', (done) => {
            var testRide = {
                "start_lat": "1.22334",
                "start_long": "2.33434",
                "end_lat": "4.8877",
                "end_long": "8.00999",
                "rider_name": "ravi",
                "driver_name": "",
                "driver_vehicle": "polo"
            }
            request(app).post('/rides')
                .send(testRide)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    if (res.body.error_code == 'VALIDATION_ERROR') {
                        done();
                    }
                });
        })
        it('should return VALIDATION_ERROR for driverVehicle empty', (done) => {
            var testRide = {
                "start_lat": "1.22334",
                "start_long": "2.33434",
                "end_lat": "4.8877",
                "end_long": "8.00999",
                "rider_name": "ravi",
                "driver_name": "chinna",
                "driver_vehicle": ""
            }
            request(app).post('/rides')
                .send(testRide)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    if (res.body.error_code == 'VALIDATION_ERROR') {
                        done();
                    }
                });
        })
        it('should return VALIDATION_ERROR for startLatitude range', (done) => {
            var testRide = {
                "start_lat": "-120.000",
                "start_long": "2.33434",
                "end_lat": "4.8877",
                "end_long": "8.00999",
                "rider_name": "ravi",
                "driver_name": "chinna",
                "driver_vehicle": "polo"
            }
            request(app).post('/rides')
                .send(testRide)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    if (res.body.error_code == 'VALIDATION_ERROR') {
                        done();
                    }
                });
        })
        it('should return VALIDATION_ERROR for startLongitude range', (done) => {
            var testRide = {
                "start_lat": "1.22334",
                "start_long": "190.000",
                "end_lat": "4.8877",
                "end_long": "8.00999",
                "rider_name": "ravi",
                "driver_name": "chinna",
                "driver_vehicle": "polo"
            }
            request(app).post('/rides')
                .send(testRide)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    if (res.body.error_code == 'VALIDATION_ERROR') {
                        done();
                    }
                });
        })
        it('should return VALIDATION_ERROR for endLatitude range', (done) => {
            var testRide = {
                "start_lat": "1.22334",
                "start_long": "2.33434",
                "end_lat": "-120.000",
                "end_long": "8.00999",
                "rider_name": "ravi",
                "driver_name": "chinna",
                "driver_vehicle": "polo"
            }
            request(app).post('/rides')
                .send(testRide)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    if (res.body.error_code == 'VALIDATION_ERROR') {
                        done();
                    }
                });
        })
        it('should return VALIDATION_ERROR for endLongitude range', (done) => {
            var testRide = {
                "start_lat": "1.22334",
                "start_long": "2.33434",
                "end_lat": "4.8877",
                "end_long": "190.000",
                "rider_name": "ravi",
                "driver_name": "chinna",
                "driver_vehicle": "polo"
            }
            request(app).post('/rides')
                .send(testRide)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    if (res.body.error_code == 'VALIDATION_ERROR') {
                        done();
                    }
                });
        })
        it('should add a new ride', (done) => {
            var testRide = {
                "start_lat": "1.22334",
                "start_long": "2.33434",
                "end_lat": "4.8877",
                "end_long": "8.00999",
                "rider_name": "ravi",
                "driver_name": "chinna",
                "driver_vehicle": "polo"
            }
            request(app).post('/rides')
                .send(testRide)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    if (res.body.length == 1) {
                        done();
                    }
                });
        })
    })

    describe('GET /rides/:id', () => {
        it('should get a ride by given id', (done) => {
            request(app).get('/rides/1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    if (res.body.length == 1) {
                        done();
                    }
                });
        })
    })

    describe('GET /rides', () => {
        it('should get a list of rides', (done) => {
            request(app).get('/rides')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    if (res.body.records.length == 1) {
                        done();
                    }
                });
        })

        it('should get a list of rides and totalcount for pagination parameters', (done) => {
            request(app).get('/rides?sort=startLat&limit=5&order=desc&page=1&fetch_total_count=true')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    if (res.body.records.length == 1 && res.body.totalCount == 1) {
                        done();
                    }
                });
        })

        it('should only get a list of rides for pagination parameters', (done) => {
            request(app).get('/rides?sort=startLat&limit=5&order=desc&page=1&fetch_total_count=false')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    if (res.body.records.length == 1 && res.body.totalCount == undefined) {
                        done();
                    }
                });
        })
    })

});