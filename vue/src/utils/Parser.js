const Parser = {};

Parser.timestampToObj = function (timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();

    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = (month > 9) ? month : "0" + month;
    day = (day > 9) ? day : "0" + day;

    return {
        year: year,
        month: month,
        day: day
    };
}

Parser.addressToObj = function (address) {
    const obj = {
        city: null,
        district: null,
        street: null,
        house: null
    };

    if (address === null)
        return obj;

    const arr = address.split(',');

    obj.city = arr[0];

    if (arr.length >= 2) {
        obj.district = arr[1];
        if (arr.length >= 3) {
            obj.street = arr[2];
            if (arr.length >= 4) {
                obj.house = arr[3];
            }
        }
    }

    return obj;
}

Parser.objToAddress = function (obj) {
    return obj.city + ", " + obj.district + ", " + obj.street + ", " + obj.house;
}

Parser.objToGraphQlQuery = function (obj) {
    let arr = [];
    Object.keys(obj).map(field => {
        let fieldStr = "";
        let fieldValue = obj[field];
        if (typeof fieldValue === 'object' && fieldValue !== null) {
            fieldStr = field + "{" + this.objToGraphQlQuery(fieldValue) + "}";
        }
        else {
            fieldStr = field;
        }
        arr.push(fieldStr);
    });
    return arr.join(',');
}

Parser.birthdayToTimestamp = function (birthday) {
    return (new Date(birthday)).getTime();
}

export {Parser};
