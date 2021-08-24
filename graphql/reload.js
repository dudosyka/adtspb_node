const Db = require('../graphql/utils/Db');
const db = new Db();

const dataMysql = require('./data');

const resData = [];
//0, 4
let query = "";
for (let item of dataMysql) {
    resData.push(item[4], item[0]);
    query += "UPDATE `user` set `email` = ? WHERE `id` = ?; ";
}

console.log('start request');

db.query(query, resData);
