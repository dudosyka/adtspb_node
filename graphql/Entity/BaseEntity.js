const Db = require('../utils/Db');

const db = new Db();

const Validator = require('../utils/Validator');

let baseEntity = function () {};

baseEntity.prototype.db = db;

baseEntity.prototype.getInstance = () => baseEntity;

baseEntity.prototype.construct = function (data) {
    this.fields = {};
    if (data.id !== undefined && data.id !== null)
    {
        return db.query( "SELECT * FROM `"+this.table+"` WHERE id = ?", [ data.id ])
            .then(data => {
                if (data.length)
                    return data[0];
                return {};
            })
            .catch(err => {
                console.error(err);
                return {};
            });
    }
    return data;
};

baseEntity.prototype.baseCreateFrom = async function (data) {
    if (data === {})
        return false;

    data = await this.construct(data);
    Object.assign(this.fields, data);
    return this;
}

baseEntity.prototype.createFromField = null;

baseEntity.prototype.createFrom = function (data) {
    if (this.createFromField !== null) {
        if (data[this.createFromInput]) {
            const req = await this.db.select(this, '`'+ this.createFromField +'` = ?', [ data[this.createFromInput] ]);
            if (req.length) {
                const model = this.newModel();
                const newData = Object.assign(req[0], data);
                model.fields = newData;
                return model;
            }
        }
    }
    return this.baseCreateFrom(data);
}

baseEntity.prototype.fields = {};

baseEntity.prototype.validateRules = function () {
    return [];
};

baseEntity.prototype.aliases = {};

baseEntity.prototype.__get = function (field) {
    let res = this.fields[field];
    let sec = null;

    if (this.aliases[field])
        sec = this.fields[this.aliases[field]];

    if (typeof res === 'undefined')
        if (sec === null)
            return null;
        else
            return sec;
    else
        return res;
};

baseEntity.prototype.__set = function (field, value) {
    let res = this.fields[field];
    let sec = null;

    console.log('field', this.fields['id']);
    console.log(typeof res);

    if (this.aliases[field])
        sec = this.fields[this.aliases[field]];

    if (typeof res === 'undefined')
        if (sec === null)
            return null;
        else {
            this.fields[this.aliases[field]] = value;
            return sec;
        }
    else {
        this.fields[field] = value;
        return value;
    }
}

baseEntity.prototype.newModel = function () {
    let instance = this.getInstance();
    return (new instance());
}

baseEntity.prototype.table = "";

baseEntity.prototype.save = async function () {
    if (this.validate())
        return await db.insert(this);
    else
        return false;
}

baseEntity.prototype.update = async function () {
    if (this.validate())
        return await db.update(this);
    else
        return false;
}

baseEntity.prototype.delete = async function () {
    return await db.delete(this);
}

baseEntity.prototype.checkForPairs = async function (field, val) {
    return await db.select(this, "`" + field + "`" + " = ?", [ val ]);
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

baseEntity.prototype.validator = function (field, onErr = "Validate error") {
    let values = field.map(el => {
        return {
            name: el,
            val: this.__get(el),
        };
    });
    return (new Validator(values, onErr));
}

baseEntity.prototype.validate = function () {
    let rules = this.validateRules();
    let errs = {};
    for (rule in rules) {
        if (!rules[rule].check())
            errs = Object.assign(errs, rules[rule].errs);
    }
    return (Object.keys(errs).length > 0) ? errs : true;
}

module.exports = baseEntity;
