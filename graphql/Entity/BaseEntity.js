const Db = require('../utils/Db');

const db = new Db();

let baseEntity = function () {};

baseEntity.prototype.construct = function (data) {
    if (this.__get('id') !== null)
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

baseEntity.prototype.__set = function (field, value)
{
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

module.exports = baseEntity;