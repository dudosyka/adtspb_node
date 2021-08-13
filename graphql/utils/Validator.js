const AppConfig = require('../config/AppConfig');

let Validator = function (fields, onErr) {
    this.fields = fields;
    this.onErr = onErr;
    this.errs = [];
}

Validator.prototype.result = true;

Validator.prototype.errs = {};

Validator.prototype.reject = function (field) {
    this.errs[field] = this.onErr;
    this.result = false;
}

Validator.prototype.fields = null;

Validator.prototype.canBeNull = true;

Validator.prototype.int = function () {
    this.fields.map(str => {
      let num = parseInt(str.val, 10);
      if (isNan(num))
        this.reject(str.name);
      let strFromNum = num.toString();
      if (strFromNum.length != str.val.length)
        this.reject(str.name);
    });
    return this;
}

Validator.prototype.email = function () {
    this.fields.map(el => {
        if (el.val !== null) {
            if (el.val.search(/^[a-zA-Z0-9._-]{1,}[@]{1}[a-zA-Z]{1,}[.]{1}[a-zA-Z]{1,}$/) == -1)
                this.reject(el.name);
        }
        else {
            this.reject(el.name);
        }
    });
    return this;
}

Validator.prototype.phone = async function () {
    this.fields.map(el => {
        if (el.val !== null) {
            if (el.val.search(/^[0-9]{10}$/) == -1) {
                this.reject(el.name);
            }
        }
        else {
            this.reject(el.name);
        }
    });
    return this;
}

Validator.prototype.notNull = function () {
    this.canBeNull = false;

    this.fields.map(el => {
        if (el.val === null)
            this.reject(el.name);
    });

    return this;
}

Validator.prototype.match = function (regex) {
    this.fields.map(el => {
        if (el.val !== null) {
            let str = el.val.toString();
            if (str.search(regex) == -1)
                this.reject(el.name);
        }
        else {
            this.reject(el.name);
        }
    });
    return this;
}

Validator.prototype.len = function (min = null, max = null) {
    if (max === null && min === null)
        return this;

    if (max === null) {
        this.fields.map(el => {
            if (el.val.length < min)
                this.reject(el.name);
        });
    }
    else if (min === null) {
        this.fields.map(el => {
            if (el.val.length > max)
                this.reject(el.name);
        });
    }
    else {
        this.fields.map(el => {
            if (el.val.length > max || el.val.length < min)
                this.reject(el.name);
        });
    }

    return this;
}

Validator.prototype.age = function (minAge, maxAge = null) {
    this.fields.map(el => {
        const dayFrom = (new Date(AppConfig.year + "-09-01")).getTime();
        const birth = el.val;
        const diff = dayFrom - birth;
        const age = Math.floor(diff / 31557600000);
        if (age < minAge || age > (maxAge ?? AppConfig.year))
            this.reject(el.name);
    });
    return this;
}

Validator.prototype.check = function (fieldsOnValidate) {
    if (this.canBeNull)
        return this.result;
    else
    {
        this.fields.map(el => {
            if (fieldsOnValidate.includes(el.name)) {
                if (el.value === null) {
                    return false;
                }
            }
        });

        return this.result;
    }
}

module.exports = Validator;
