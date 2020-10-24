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
 * @param entity <null|function>
 * @returns {Promise<unknown>}
 *
 * Executes query to database
 */
Db.prototype.query = function (query, data = [], entity = null) {
    return new Promise((resolve, reject) => {
        this.connection.query(query, data, (err, rows) => {
            //If any errs returns them
            if (err) reject(err);

            //If there are no errs, returns the received data
            (new Promise((resolve, reject) => {
                rows
                resolve();
            })).catch(err => {
                reject(err);
            }).then(() => {
                if (entity === null)
                {
                    resolve(true);
                }
                let result = [];
                rows.map(el => {
                    result.push(new entity(el));
                });
                resolve(result);
            });
        });
    });
}

/**
 * @param entity <Entity>
 * @param query <String>
 * @param bindings <Array>
 * @returns {Promise<unknown>}
 *
 * Get all rows of data selected in table
 */
Db.prototype.select = async function (entity, query, bindings)
{
    return await this.query("SELECT * FROM " + entity.table + " WHERE " + query, bindings, entity.getInstance());
}

/**
 * @param entity <Entity>
 * @param query <String>
 * @param bindings <Array>
 * @returns {Promise<unknown>}
 *
 * Get one row of data selected from table
 */
Db.prototype.selectOne = async function(entity, query, bindings)
{
    return await this.query("SELECT * FROM " + entity.table + " WHERE " + query + " LIMIT 1", bindings, entity.getInstance());
}

/**
 * @param entity <Entity>
 * @returns {Promise<unknown>}
 *
 * Delete entity
 */
Db.prototype.delete = async function (entity)
{
    //Build simple delete request like: "DELETE FROM `xxx` WHERE `id` = XX" and execute id
    return await this.query('DELETE FROM ' + entity.table + ' WHERE `id` = ?', [ entity.id ])
}

/**
 * @param entity <Entity>
 * @param query <String>
 * @param bindings <Array>
 * @returns {Promise<unknown>}
 *
 * Delete all entities caught in the request
 */
Db.prototype.deleteWhere = async function (entity, query, bindings)
{
    //Build request with extra where query
    return await this.query('DELETE FROM ' + entity.table + ' WHERE ' + query, bindings);
}

/**
 * @param entity <Entity>
 * @returns {Promise<unknown>}
 *
 * Update entity
 */
Db.prototype.update = async function (entity)
{
    //Build SET part of request (SET id = ?, field = ?, fieldN = ?.....)
    const set = 'SET ' + Object.keys(entity.fields).join(' = ?,') + ' = ?';

    //Build full request like UPDATE `XXX` SET id = XX, {...} WHERE `id` = XX
    const query = "UPDATE " + entity.table + " " + set + " WHERE id = ?";

    //Get entity`s fields value and put it in the array
    const bindings = Object.values(entity.fields);

    return await this.query(query, bindings)
}

/**
 * @param entity <Entity>
 * @param fields <Array>
 * @param query <String>
 * @param bindings <Array>
 * @returns {Promise<unknown>}
 *
 * Update all entities caught in the request
 */
Db.prototype.updateWhere = async function (entity, fields = false, query = false, bindings = [])
{
    //Build SET part of request (SET id = ?, field = ?, fieldN = ?.....)
    const set = 'SET ' + Object.keys(fields).join(' = ?,') + ' = ?';

    //Build full request like UPDATE `XXX` SET id = XX, {...} WHERE `id` = XX
    query = "UPDATE " + entity.table + " " + set + " WHERE " + query;

    return await this.query(query, bindings)
}

module.exports = Db;