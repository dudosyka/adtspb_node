const redis = require("redis");
const redisClient = redis.createClient();

module.exports = {
    instance: redisClient,
    client: null,
    //TODO Create redis 'orm' client (need?)
    //{
    //     hmset: (data, callback) => {
    //         redisClient.hmset(data, (err, res) => {
    //             callback(err, res);
    //         });
    //     },
    //     hmget: (redisKey, hashKeys, callback) => {
    //         redisClient.hmget(redisKey, hashKeys, (err, res) => {
    //             callback(err, res);
    //         })
    //     }
    // }
}