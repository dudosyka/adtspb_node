const Db = require('../utils/Db');

const db = new Db();

module.exports = {
    construct: (entity, data) =>
    {
        if (data.id !== null)
        {
            return db.query( "SELECT * FROM `"+entity.table+"` WHERE id = ?", [ data.id ])
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
    }
}
