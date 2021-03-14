const Db = require('../utils/Db');

const db = new Db();

const Validator = require('../utils/Validate');

let baseEntity = function () {};

baseEntity.prototype.construct = function (data) {
    if (data.id !== undefined && data.id !== null)
    {
        return db.query( "SELECT * FROM `"+this.table+"` WHERE id = ?", [ data.id ])
            .then(data => {
                if (data.length)
                    return data[0];
                return [];
            })
            .catch(err => {
                console.error(err);
                return [];
            });
    }
    return data;
};

baseEntity.prototype.fields = {};

baseEntity.prototype.__get = function (field) {
    let res = this.fields[field];

    if (typeof res === 'undefined')
        return null;
    else
        return res;
};

baseEntity.prototype.__set = function (field, value) {
    let res = this.fields[field];

    if (typeof res === 'undefined')
        return null;
    else {
        this.fields[field] = value;
        return value;
    }
}

baseEntity.table = "";

baseEntity.prototype.save = async function () {
    return await db.insert(this);
}

baseEntity.prototype.update = async function () {
    return await db.update(this);
}

baseEntity.prototype.delete = async function () {
    return await db.delete(this);
}

baseEntity.prototype.checkForPairs = async function (field, val) {
    return await db.select(this, field + "=?", [ val ]);
}

baseEntity.prototype.search = async function (Search) {
    let query = "";
    let data = [];

    let i = 0;
    Object.keys(Search).map(el => {
        let field = Search[el];
        field = "%" + field + "%";
        data.push(field);
        query += "`" + el +"` LIKE ?";
        if (i + 1 !== Object.keys(Search).length) {
            query += ",";
        }
         i++;
    });

    return await db.select(this, query, data);
}

//Validate method (for all types, realization of validation methods is in {home}/utils/validate.js)
baseEntity.prototype.validate = async function (field, type) {
    return Validator(type, this.__get(field))
                .then(data => data)
                .catch(err => {
                    throw new Error(err);
                });
}

module.exports = baseEntity;
