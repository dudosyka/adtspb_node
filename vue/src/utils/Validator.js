const Parser = require('./Parser');
const Validator = {};

Validator.validateEmail = function (email) {
    return typeof email === 'string' ? email.search(/^[a-zA-Z0-9._-]{1,}[@]{1}[a-zA-Z]{1,}[.]{1}[a-zA-Z]{1,}$/) != -1 : false;
}

function isEmpty(str) {
     return (/^\s*$/.test(str) || str === null || str === '' || str === undefined);
}

Validator.validateNotEmpty = function (val, obj = false, exceptFields = []) {
    if (!obj)
        return (val !== null && val !== undefined && val != "");

    const errs = [];
    Object.keys(val).map(id => {
        const el = val[id];
        if (id == "residence_address" || id == 'registration_address') {
            const validateRes = this.validateAddressNotEmpty(el);
            if (validateRes !== true)
            {
                errs.push({
                    [id]: validateRes
                });
            }
        }
        else {
            console.log(id, isEmpty(el));
            if (!exceptFields.includes(id))
                if (isEmpty(el))
                    errs.push(id);
        }
    });

    if (errs.length)
        return errs;
    else
        return true;
}

Validator.validateAddressNotEmpty = function (address) {
    return this.validateNotEmpty({...address}, true);
}

Validator.validatePhone = function (phone, full = false) {
    return full ? phone.search(/^[0-9]{11}$/) != -1 : phone.search(/^[0-9]{10}$/) != -1;
}

export {Validator};
