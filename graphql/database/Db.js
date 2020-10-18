const mysql = require('mysql');

/**
 * @constructor
 *
 * Initialize database connection
 */
let Db = function ()
{
    this.connection = mysql.createConnection(
        require('../config/database')
    );

    this.connection.connect();
}

/**
 * @param query <String>
 * @param data <Array>
 * @returns {Promise<unknown>}
 *
 * Executes query to database
 */
Db.prototype.query = function (query, data) {
    return new Promise((resolve, reject) => {
        this.connection.query(query, data, (err, rows) => {
            //If any errs returns them
            if (err) reject(err);
            //If there are no errs, returns the received data
            resolve(rows);
        })
    })
}

module.exports = Db;