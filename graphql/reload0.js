const Db = require('../graphql/utils/Db');
const db = new Db();
const Crypt = require('./utils/Crypt');

const passwords = require('./pass');
(async function () {
    for (el of passwords) {
        const password = await Crypt.crypt(el.password);
        const data = [
            password, el.id
        ]
        await db.query('update user set `password` = ? where `id` = ?', data);
    }
})();
