const mysql = require('mysql');
const db_cnf = require('../config/database');

/**
 * @constructor
 *
 * Initialize database connection
 */
let Db = function ()
{
    this.connection = mysql.createConnection({
        ...db_cnf,
        multipleStatements: true
    });

    this.connection.connect();
}

/**
 * @param query <String>
 * @param data <Array>
 * @param entity <null|function>
 * @param asArray <boolean>
 * @returns {Promise<unknown>}
 *
 * Executes query to database
 */
Db.prototype.query = function (query, data = [], entity = null) {
    return new Promise((resolve, reject) => {
        this.connection.query(query, data, async (err, res) => {
            console.log("DB_LOG: ", {
                query: query,
                data: data
            });
            //If any errs returns them
            if (err) reject(err);

            //If any errs return null (or when select returns empty \_(._.)_/ )
            if (typeof res === 'undefined')
            {
                resolve(null);
            }
            //If we get not a select query then return result which contain information about affected rows
            else if (res.affectedRows)
                resolve(res);
            else
                resolve(res);
        });
    });
}

Db.prototype.createRangeQuery = function (field, arr, selected_field = 'id')
{
    let ids = [];
    let query = " " + selected_field + " in (";
    let i = 0;
    arr.map(el => {
        ids.push(el[field]);
        query += "?";
        if (i + 1 < arr.length)
            query += ",";
        i++;
    });
    query += ")";

    return {ids: ids, query: query};
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
    return await this.query('DELETE FROM ' + entity.table + ' WHERE `id` = ?', [ entity.__get('id') ])
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
    let columns = await this.query("SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`= ?  AND `TABLE_NAME`= ?",[ db_cnf.database, entity.table ]).then(data => data.map(el => el.COLUMN_NAME));

    let fields = Object.keys(entity.fields).filter(el => columns.includes(el));
    let values = fields.map(el => entity.fields[el]);


    //Build SET part of request (SET id = ?, field = ?, fieldN = ?.....)
    const set = 'SET ' + fields.join(' = ?,') + ' = ?';

    //Build full request like UPDATE `XXX` SET id = XX, {...} WHERE `id` = XX
    const query = "UPDATE " + entity.table + " " + set + " WHERE id = ?";

    //Get entity`s fields value and put it in the array
    const bindings = values.concat([ entity.fields['id'] ]);

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

//TODO Create insert method (SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='xxx'  AND `TABLE_NAME`='xxx';)
Db.prototype.insert = async function (entity)
{
    let columns = await this.query("SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`= ?  AND `TABLE_NAME`= ?",[ db_cnf.database, entity.table ]).then(data => data.map(el => el.COLUMN_NAME));

    let req = "INSERT INTO " + entity.table + " (";
    let reqSecondPart = ") VALUES (";

    let fields = Object.keys(entity.fields);
    let data = [];
    let i = 0;

    fields.map(el => {
        if (el !== 'id')
        {
            if (!columns.includes(el))
                return;
            req += el;
            reqSecondPart += "?";
            data.push(entity.fields[el]);
            if (i + 1 != fields.length)
            {
                req += ",";
                reqSecondPart += ",";
            }
        }
        i++;
    });

    reqSecondPart = reqSecondPart.replace(/(^,)|(,$)/g, "") + ")";
    req = req.replace(/(^,)|(,$)/g, "") + reqSecondPart;
    return this.query(req, data);
}

module.exports = Db;
