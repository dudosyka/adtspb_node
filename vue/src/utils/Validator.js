const Parser = require('./Parser');
const Validator = {};

Validator.validateEmail = function (email) {
    return email.search(/^[a-zA-Z0-9._-]{1,}[@]{1}[a-zA-Z]{1,}[.]{1}[a-zA-Z]{1,}$/) != -1;
}

Validator.validateNotEmpty = function (val, obj = false) {
    if (!obj)
        return (val !== null && val !== undefined && val != "");

    const errs = [];
    Object.keys(val).map(id => {
        const el = val[id];
        console.log(id, el);
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
            if (el === null || el === undefined || el === "")
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

Validator.validatePhone = function (phone) {
    return phone.search(/^[0-9]{11}$/) != -1;
}

export {Validator};
